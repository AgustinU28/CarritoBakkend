import { CartManager } from "../dao/dbManagers/DBcartManager.js";
import { TicketManager } from "../dao/dbManagers/DBticketManager.js";
const cartManager = new CartManager()
const ticketManager = new TicketManager();

export class CartController {  
    getById = async (req, res)=>{
        const { cid } = req.params;
        const username = req.session.username
        let userRole, adminRole; userRole = adminRole = false;
        req.session.role == 'admin' ? adminRole = true : userRole = true;
        let cart;
        try {
            cart = await cartManager.getById(cid);
            if(!cart){
                req.logger.error(`Error: El carrito ${cid} no existe`);
                return res.status(404).json({message: `El carrito ${cid} no existe`})
                }
        } catch (error) {
            if (error.name == 'CastError') {
            req.logger.error(`Error: El id del carrito ingresado es inválido`);
            return res.status(400).json({ message: `El id del carrito ingresado es inválido` });
            }
            req.logger.error(`Error: ${error}`);
            return res.status(500).json({ message: `Error interno: ${error}` });
        }
        const products = [...cart.products];
        const prodsTemp = [];
        const equalIDs = (currProd, tmpProd) => { 
            if(tmpProd.product._id == currProd.product._id){
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
        // return res.status(200).json({ prodsTemp, total, username, adminRole, userRole})
        return res.status(200).render('cart',{prodsTemp,total,username,adminRole,userRole})
    }
    add = async(req,res)=>{
        try {
            const cart = await cartManager.add();
            return res.status(201).json({message: `Carrito con id:${cart._id} creado exitosamente`, payload: cart})
        } catch (error) {
            req.logger.error(`Error: ${error}`);
            return res.status(500).json({ message: `Error interno: ${error}` });
        }
    }
    addProductToCart = async(req,res)=>{
        const {cid, pid} = req.params;
        let cart
        try {
            cart = await cartManager.getById(cid);
            if(!cart){
                req.logger.error(`Error: El carrito ${cid} no existe`);
                return res.status(404).json({message: `El carrito ${cid} no existe`})
                }
        } catch (error) {
            if (error.name == 'CastError') {
            req.logger.error(`Error: El id del carrito ingresado es inválido`);
            return res.status(400).json({ message: `El id del carrito ingresado es inválido` });
            }
            req.logger.error(`Error: ${error}`);
            return res.status(500).json({ message: `Error interno: ${error}` });
        }
        try {
            let response = await cartManager.addProductToCart(cart,pid);
            return res.status(201).json({message: `Producto ${pid} agregado correctamente al carrito ${cid}`, response})
        } catch (error) {
            if (error.name == 'CastError') {
                req.logger.error(`Error: El id del producto ingresado es inválido`);
                return res.status(400).json({ message: `El id del producto ingresado es inválido` });
                }
            req.logger.error(`Error: ${error}`);
            return res.status(500).json({ message: `Error interno: ${error}` });
        }
    }
    totalProds = async (req,res) =>{
        const { cid } = req.params;
        let cart
        try {
            cart = await cartManager.getById(cid);
            if(!cart){
                req.logger.error(`Error: El carrito ${cid} no existe`);
                return res.status(404).json({message: `El carrito ${cid} no existe`})
                }
            let products = [...cart.products];
            return res.status(200).json({count:products.length})
        } catch (error) {
            if (error.name == 'CastError') {
            req.logger.error(`Error: El id del carrito ingresado es inválido`);
            return res.status(400).json({ message: `El id del carrito ingresado es inválido` });
            }
            req.logger.error(`Error: ${error}`);
            return res.status(500).json({ message: `Error interno: ${error}` });
        }

    }
    delete = async (req,res) => {
        const {cid} = req.params;
        try {
            const response = await cartManager.deleteById(cid);
            if(!response){
                req.logger.error(`Error: El carrito ${cid} no existe`);
                return res.status(404).json({message: `El carrito ${cid} no existe`})
                }
            return res.status(200).json({message: `El carrito con id: ${cid} fue eliminado exitosamente`, response})
        } catch (error) {
            if (error.name == 'CastError') {
                req.logger.error(`Error: El id del carrito ingresado es inválido`);
                return res.status(400).json({ message: `El id del carrito ingresado es inválido` });
            }
            req.logger.error(`Error: ${error}`);
            return res.status(500).json({ message: `Error interno: ${error}` });
        }
    }
    deleteProductOfCart = async(req,res) => {
        const { cid, pid } = req.params;
        try {
            const response = await cartManager.deleteProductOfCart(cid, pid);
            if(!response){
                req.logger.error(`Error: El carrito ${cid} no existe`);
                return res.status(400).json({message: `El carrito ${cid} no existe`})
                }
            return res.status(200).json({ message: `El producto ${pid} fue eliminado exitosamente del carrito`, response})
        } catch (error) {
            if (error.name == 'CastError') {
                req.logger.error(`Error: El id del carrito ingresado es inválido`);
                return res.status(400).json({ message: `El id del carrito ingresado es inválido` });
            }
            req.logger.error(`Error: ${error}`);
            return res.status(500).json({ message: `Error interno: ${error}` });
        }
    }
    updateProductOfCart = async(req, res) => {
        const {cid, pid} = req.params;
        const {qty} = req.body;
        try {
            const response = await cartManager.updateProductOfCart(cid, pid, qty);
            if(!response){
                req.logger.error(`Error: El carrito ${cid} no existe`);
                return res.status(400).json({message: `El carrito ${cid} no existe`})
                }
            return res.status(200).json({ message: `Se agregaron ${qty} del producto ${pid} en el carrito`, response})
        } catch (error) {
            if (error.name == 'CastError') {
                req.logger.error(`Error: El id del carrito ingresado es inválido`);
                return res.status(400).json({ message: `El id del carrito ingresado es inválido` });
            }
            req.logger.error(`Error: ${error}`);
            return res.status(500).json({ message: `Error interno: ${error}` });
        }
    }
    updateManyProductsOfCart = async(req,res) => {
        const {cid} = req.params;
        const {newProducts} = req.body;
        try {
            const response = await cartManager.updateManyProductsOfCart(cid, newProducts);
            if(!response){
                req.logger.error(`Error: El carrito ${cid} no existe`);
                return res.status(404).json({message: `El carrito ${cid} no existe`})
                }
            return res.status(200).json({ message: `Se agregaron nuevos productos en el carrito`, response})
        } catch (error) {
            if (error.name == 'CastError') {
                req.logger.error(`Error: El id del carrito o del producto ingresado es inválido`);
                return res.status(400).json({ message: `El id del carrito o del producto ingresado es inválido` });
            }
            if (error.name == 'TypeError') {
                req.logger.error(`Error: El id del carrito ingresado es inválido`);
                return res.status(400).json({ message: `El id del carrito ingresado es inválido` });
            }
            req.logger.error(`Error: ${error}`);
            return res.status(500).json({ message: `Error interno: ${error}` });
        }
    }
    generateTicket = async(req,res) => { 
        const {cid} = req.params;
        const username = req.session.username;
        let cart;
        try {
            cart = await cartManager.getById(cid);
            if(!cart){
                req.logger.error(`Error: El carrito ${cid} no existe`);
                return res.status(404).json({message: `El carrito ${cid} no existe`})
                }
        } catch (error) {
            if (error.name == 'CastError') {
            req.logger.error(`Error: El id del carrito ingresado es inválido`);
            return res.status(400).json({ message: `El id del carrito ingresado es inválido` });
            }
            req.logger.error(`Error: ${error}`);
            return res.status(500).json({ message: `Error interno: ${error}` });
        }
        const response = await ticketManager.addTicket(cart,username); 
        req.logger.info(`Info: El ticket con código: ${response.ticket.code} se ha generado con éxito`);
        return res.status(201).json({message: "Ticket generado", response}) 
    }
}

