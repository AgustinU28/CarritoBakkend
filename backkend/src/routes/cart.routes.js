import { Router } from "express";
import { ProductManager } from "../dao/dbManagers/DBproductManager.js";
import { CartManager } from "../dao/dbManagers/DBcartManager.js";
import { TicketManager } from "../dao/dbManagers/DBticketManager.js";


const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();
const ticketManager = new TicketManager();

router.post("/", async(req, res)=>{
    try {
        const response = await cartManager.addCart();
        res.json({
            message: "Carrito creado exitosamente",
            data: response
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error interno: ' + error,
        });
    }
})

router.get("/:cid", async (req, res) => {
    try {
        const username = req.session.username
        let userRole = false;
        let adminRole = false;
        req.session.role == 'admin' ? adminRole = true : userRole = true;
        const {cid} = req.params;
        const cart = await cartManager.getCartById(cid); 
        let products = [...cart.products];
        let prodsTemp = [];
        let equalIDs = (currProd, tmpProd) =>{
            if (tmpProd.product._id.equals(currProd.product._id)) {
                return true
            } else {
                return false
            }
        }
        for (let i = 0; i < products.length; i++) {
            let prodIndex = prodsTemp.findIndex(prod => {
                if(equalIDs(products[i],prod)){
                    return true
                }
            })
            if (prodIndex == -1) {
                let price = products[i].product.price
                prodsTemp.push({...products[i],quantity:1, price: price})
            } else {
                let newQuantity = Number(prodsTemp[prodIndex].quantity) + 1;
                let newPrice = Number(prodsTemp[prodIndex].product.price) * newQuantity;
                prodsTemp[prodIndex] = {...prodsTemp[prodIndex], price: newPrice, quantity: newQuantity}
            }

        }
        let total = 0;
        products.forEach(product => {
            total += product.product.price
        })
        res.render('cart',{prodsTemp,total,username,adminRole,userRole})
        // res.json({prodsTemp,total,username,adminRole,userRole})
    } catch (error) {
        res.status(500).json({error: error})
    }
  
  });

router.get('/:cid/totalprods', async (req, res)=>{
    const {cid} = req.params;
    const cart = await cartManager.getCartById(cid); 
    if (cart){
        let products = [...cart.products];
        res.json({'count':products.length})
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    // Aquí es donde debes agregar el código que proporcioné anteriormente
    try {
      const { cid, pid } = req.params;
      console.log("CID:", cid); // Agrega este log para verificar el valor de 'cid'
      const cart = await cartManager.getCartById(cid);
      console.log("CART:", cart); // Agrega este log para verificar el valor de 'cart'
      let response = await cartManager.addProductToCart(cart, pid);
      res.json({
        message: "Producto agregado correctamente",
        producto: pid,
        cart: response
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  });
  

router.delete('/:cid', async (req,res)=>{
    try{
        const {cid} = req.params;
        const response = await cartManager.deleteCartById(cid);
        res.json({
            message: "Carrito eliminado",
            cartID: cid,
            respuesta: response
        })
    } catch (error){
        res.status(500).json({error})
    }
})

router.delete('/:cid/product/:pid', async (req,res)=>{
    try{
        const {cid, pid} = req.params;
        const response = await cartManager.deleteProductOfCart(cid, pid);
        res.json({
            message: "Producto eliminado del carrito",
            cartID: cid,
            prodId: pid,
            respuesta: response
        })
    } catch (error){
        res.status(500).json({error})
    }
})

router.put('/:cid/product/:pid', async (req,res) =>{
    try{
        const {cid, pid} = req.params;
        const {qty} = req.body;
        const response = await cartManager.updateQtyProdCart(cid, pid, qty);
        res.json({
            message: "Cantidad del producto actualizada",
            cartID: cid,
            prodId: pid,
            Quantity: qty,
            respuesta: response
        })
    } catch (error){
        res.status(500).json({error})
    }
})

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { newProducts } = req.body;
    try {
        const response = await cartManager.updateArrCart(cid, newProducts);
        res.json({
            message: 'Productos agregados al carrito',
            respuesta: response
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar productos al carrito', error: error });
    }
});

router.get('/:cid/purchase', async (req, res) => {
    const { cid } = req.params;
    const username = req.session.username;
    const cart = await cartManager.getCartById(cid);
    const resp = await ticketManager.addTicket(cart, username);
    console.log('en cartroutes');
    console.log({ resp });
    res.json({ message: "Ticket generado", respuesta: resp });
});



export default router;