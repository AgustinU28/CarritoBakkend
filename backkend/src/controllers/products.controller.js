import { ProductManager } from "../dao/dbManagers/DBproductManager.js";

const productManager = new ProductManager()

export class ProductController {  
    getAll = async (req, res) => {
      let { limit, page, sorted, search } = req.query;
      const {username, role} = req.session;
      const products = await productManager.getAll( limit , page , sorted , search )
     
      // Parámetros para la plantilla de Handlebars
      let noSort, mayorSort, menorSort, limit25, limit10; noSort = mayorSort = menorSort = limit25 = limit10 = false;
      let userRole, adminRole, premiumRole;
      if(limit == undefined){
        limit = 10
      }
      limit == 25 ? limit25 = true : limit10 = true; 
      (sorted == 1) ? menorSort = true
                    : (sorted == -1) ? mayorSort = true
                    : noSort = true;
      role == "admin" ? adminRole = true
                    : role == "premium" ? premiumRole = true
                    : userRole = true;
      // return res.status(200).json({
      //   products: products.docs,
      //       hasPrevPage: products.hasPrevPage,
      //       hasNextPage: products.hasNextPage,
      //       prevPage: products.prevPage,
      //       nextPage: products.nextPage,
      //       totalDocs: products.totalDocs,
      //       totalPages: products.totalPages,
      //       page: products.page,
      //       pagingCounter: products.pagingCounter,
      //       limit, limit25, limit10,
      //       noSort, mayorSort, menorSort,
      //       username,
      //       userRole, adminRole,
      //   })
      if (products.docs.length === 0) {
        return res.status(404).render('products', {        
          limit, limit25, limit10,
          noSort, mayorSort, menorSort,
          username,
          userRole, adminRole, premiumRole,
          search
          }
        )
      }
      return res.status(200).render("products", {
        products: products.docs,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        totalDocs: products.totalDocs,
        totalPages: products.totalPages,
        page: products.page,
        pagingCounter: products.pagingCounter,
        limit,limit10,limit25,
        noSort, mayorSort, menorSort,
        username,
        userRole, adminRole, premiumRole,
        search
        })
    }
    getById = async (req, res) => {
      const {pid} = req.params;
      try {
        let product = await productManager.getById(pid)
        if (product) {
          return res.status(200).json({product})
        }
      }
      catch (error) {
        req.logger.warning('Warning: El producto solicitado no existe')
        res.status(404).json({
          message: "El producto solicitado no existe",
      })
    }

    }
    add = async (req,res) => {
      const { title, description, price, code, stock, owner, thumbnail } = req.body;
        try {
          let response = await productManager.getByCode(code)
          if (response) {
            req.logger.error(`Error: El código ${code} identifica a otro producto existente`);
            return res.status(400).json({message: `El código ${code} identifica a otro producto existente`})
          }
        } catch (error) {
          req.logger.error(`Error: ${error}`);
          return res.status(500).json({ message: `Error interno: ${error}` });
        }
        try {
          if (!title || !description || !price || !code || !stock || !owner || !thumbnail) {
            req.logger.warning('Warning: Parámetros faltantes para crear un nuevo producto');
            return res.status(400).json({message: "Parámetros faltantes para crear un nuevo producto"})
          }
          const product = await productManager.add({title, description, price, code, stock, owner, thumbnail})
          return res.status(201).json({message: "Producto agregado correctamente", payload: product})
        } catch (error) {
          req.logger.error(`Error: ${error}`);
          return res.status(500).json({ message: `Error interno: ${error}` });
        }
    }
    update = async (req, res) => {
      const {pid} = req.params;
      const { title, description, price, code, stock, owner, thumbnail } = req.body;
      let product;
      try {
        product = await productManager.getById(pid);
        if(!product){
          req.logger.error(`Error: El producto ${pid} no existe`);
          return res.status(404).json({message: `El producto ${pid} no existe`})
        }
      } catch (error) {
        if (error.name == 'CastError') {
          req.logger.error(`Error: El id del producto ingresado es inválido`);
          return res.status(400).json({ message: `El id del producto ingresado es inválido` });
        }
        req.logger.error(`Error: ${error}`);
        return res.status(500).json({ message: `Error interno: ${error}` });
      }
      try{
        await productManager.updateById(pid, {title, description, price, code, stock, owner, thumbnail})
        return res.status(200).json({message: `El producto ${product.title} ha sido modificado correctamente`})
      }catch(error){
        req.logger.error(`Error: ${error}`);
        return res.status(500).json({ message: `Error interno: ${error}` });
      }
    }
    delete = async (req, res) => {
      const { pid } = req.params;
      let product;
      try {
        product = await productManager.getById(pid);
        if(!product){
          req.logger.error(`Error: El producto ${pid} no existe`);
          return res.status(404).json({message: `El producto ${pid} no existe`})
        }
      } catch (error) {
        if (error.name == 'CastError') {
          req.logger.error(`Error: El id del producto ingresado es inválido`);
          return res.status(400).json({ message: `El id del producto ingresado es inválido` });
        }
        req.logger.error(`Error: ${error}`);
        return res.status(500).json({ message: `Error interno: ${error}` });
      }
      try{
        let response = await productManager.deleteById(pid);
        return res.status(200).json({message: `El producto ${product.title} ha sido eliminado correctamente`, response})
      }catch(error){
        req.logger.error(`Error: ${error}`);
        return res.status(500).json({ message: `Error interno: ${error}` });
      }
    }
}


