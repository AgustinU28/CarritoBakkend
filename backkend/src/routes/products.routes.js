import { Router } from "express";
import { ProductManager } from "../dao/dbManagers/DBproductManager.js"
import { authUser } from "./session.routes.js";

const router = Router();

const productManager = new ProductManager()


router.get('/', authUser, async (req,res)=>{
    let username = req.session.username;
    let userRole = false;
    let adminRole = false;
    req.session.role == 'admin' ? adminRole = true : userRole = true;

    let limitSet = req.query.limit || 10;
    let pageSet = req.query.page || 1;
    let sortSet = req.query.sorted || 0;
    let value = req.query.search || "";
    
    try {
        const respuesta = await productManager.getProducts(limitSet, pageSet, sortSet, value);
        const { docs, page, hasPrevPage, hasNextPage, nextPage, prevPage, limit, totalDocs, totalPages } = respuesta.response;
        const products = docs;
        let noSort = false;
        let mayorSort = false;
        let menorSort = false;
        let limit25 = false;
        let limit10 = false;
        
        limit==25 ? limit25 = true : limit10=true; 
        
        if (respuesta.sortProd == 0) {
            noSort = true;
        }
        if (respuesta.sortProd == -1) {
            mayorSort = true;
        }
        if (respuesta.sortProd == 1) {
            menorSort = true;
        }
        
        res.render( "products", {
            products,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            limit,
            limit25,
            limit10,
            totalDocs,
            totalPages,
            page,
            noSort, mayorSort, menorSort,
            username,
            userRole,
            adminRole
          });
    }
     catch (err) {
        req.logger.error(`Error: ${err}`)
        res.json({ data: err });
    }
})

router.get('/allproducts', async (req,res) =>{
    const respuesta  = productManager.getAllProducts();
    return respuesta
})

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
  
    let product = await productManager.getProductById(pid);
  
    if (product) {
      res.json({ message: "success", data: product });
    } else {
        req.logger.warning('Warning: El producto solicitado no existe')
      res.json({
        message: "El producto solicitado no existe",
      });
    }
  });

router.post("/", async(req, res)=>{
    const {
        title,
        description,
        price,
        code,
        stock,
        owner,
        thumbnail
    } = req.body;
    if (!title || !description || !code || !price || !stock) {
        req.logger.error('Error: Datos incompletos');
        res.json({ message: "Datos incompletos" });
      } else { 
        
        try {
            let productToAdd = {
                title,
                description,
                price,
                code,
                stock,
                owner,
                thumbnail,
            }
            const response = await productManager.addProduct(productToAdd);
            res.json({
                message: "Producto agregado correctamente",
                data: response
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error interno: ' + error,
            });
        }
    }
})

router.put('/:pid', async (req, res)=>{
    const {pid} = req.params;
    const {
        title,     
        description,
        price,
        code,
        stock,
        thumbnail
    } = req.body;

    let product = await productManager.getProductById(pid);
    let updatedFields = {}
    if (product) {
        updatedFields.title=title || product.title;
        updatedFields.description=description || product.description;
        updatedFields.price=price || product.price;
        updatedFields.code=code || product.code;
        updatedFields.stock=stock || product.stock;
        updatedFields.thumbnail=thumbnail || product.thumbnail;
        
        let result = await productManager.updateProductById(pid, updatedFields);
        res.json({message: "Producto modificado correctamente", new: updatedFields, old: product})
    } else {
        res.json({
            message: "No se ha encontrado el producto que desea modificar"
        })
    }
})

router.delete('/:pid', async(req,res)=>{
    const { pid } = req.params;
    let product = await productManager.getProductById(pid);
    if (product) {
        let result = await productManager.deleteProductById(pid);
        res.json({ message: "Producto eliminado correctamente", data: result });
    } else {
        res.json({
            message: "No se ha encontrado el producto que desea eliminar"
        })
    }
})

  export default router;