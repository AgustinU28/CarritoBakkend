import { CartManager } from "../dao/dbManagers/DBcartManager.js";
import { ProductManager } from "../dao/dbManagers/DBproductManager.js";
import PaymentService from "../services/payment.js";
import { ticketsModel } from "../dao/models/tickets.model.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { __dirname } from "../utils.js";

const cartManager = new CartManager();
const productManager = new ProductManager();


export class PaymentController {  
    paymentIntent = async (req, res)=>{
        const {cartId, username} = req.body;
        
        let cart;
        try {
            cart = await cartManager.getById(cartId);
            if(!cart){
                req.logger.error(`Error: El carrito ${cartId} no existe`);
                return res.status(404).json({message: `El carrito ${cartId} no existe`})
                }
        } catch (error) {
            if (error.name == 'CastError') {
            req.logger.error(`Error: El id del carrito ingresado es inválido`);
            return res.status(400).json({ message: `El id del carrito ingresado es inválido` });
            }
            req.logger.error(`Error: ${error}`);
            return res.status(500).json({ message: `Error interno: ${error}` });
        }
        
        let products = [...cart.products];

        let prodsTemp = [];

        // fn para comparar igualdad entre pid
        const equalIDs = (currProd, tmpProd) => { 
            if(tmpProd.product._id == currProd.product._id){
                return true        
            } else {
                return false
            }
        }
        // Reccorro los productos del carrito, para buscar duplicados, agrego un nuevo array de objetos para determinar cantidades y precio total
        for (let i = 0; i < products.length; i++) {
            let prodIndex = prodsTemp.findIndex(prod => { if(equalIDs(products[i],prod)){ return true } })
            if (prodIndex == -1) {
                let price = Number(products[i].product.price);
                prodsTemp.push({...products[i],quantity:1, price: price})
            } else {
                let newQuantity = Number(prodsTemp[prodIndex].quantity) + 1;
                let newPrice = Number(prodsTemp[prodIndex].price) * newQuantity;
                prodsTemp[prodIndex] = {...prodsTemp[prodIndex], price: newPrice, quantity: newQuantity}
            }
        }
        // arrays para separar entre aquellos productos que cuentan con stock y los que no
        let remainingProds = [];
        let purchasedProds = [];

        for (let i = 0; i < prodsTemp.length; i++) {
            let productID = prodsTemp[i].product._id;
            let currProd = await productManager.getById(productID);
            let actualStock = currProd.stock;
            let quantity = prodsTemp[i].quantity;
            let tmpIndex = products.findIndex(prod => equalIDs(prodsTemp[i],prod))
            let cartProd = products[tmpIndex]
            // Casos, si el pedido es mayor al stock o si supera al stock actual
            if(actualStock - quantity > 0){
                let newProductStock = actualStock - quantity;
                await productManager.updateById(productID, {stock: newProductStock})
                for (let i = 0; i < quantity; i++) {
                    purchasedProds.push(cartProd)
                }
            } else {
                if(actualStock == 0){
                    for (let i = 0; i < quantity; i++) {
                        remainingProds.push(cartProd) 
                    }
                } else {
                    await productManager.updateById(productID, {stock: 0})
                    let purchaseQty = actualStock;
                    for (let i = 0; i < purchaseQty; i++) {
                        purchasedProds.push(cartProd)
                    }
                    let remainQty = quantity - actualStock;
                    for (let i = 0; i < remainQty; i++) {
                        remainingProds.push(cartProd)
                    }
                }
            }
        }

        // Actualizo el carrito con los productos que no hay stock
        if (remainingProds.length > 0){
            await cartManager.modifyArrCart(cart._id, remainingProds)
        }
        // Calculo el total de la compra
        let amount = 0;
        purchasedProds.forEach(product => { amount += Number(product.product.price) })


        let newTicket = {
            code: crypto.randomUUID(),
            purchase_datetime: new Date(),
            amount: amount,
            purchaser: username,
            purchasedProds: purchasedProds,
            remainingProds: remainingProds,
        }

        const respose = await ticketsModel.create(newTicket);
        const ticketId = respose._id; 


        const paymentIntentInfo = {
            amount: amount,
            cart: cartId,
            username: username,
            purchasedProds: purchasedProds,
            remainingProds: remainingProds,
            ticketId: ticketId
        };
        const service = new PaymentService();
        let result;
        try {
            result = await service.createPaymentIntent(paymentIntentInfo);
        } catch (error) {
            console.log(error)
        }
        res.json({status: 'success', payload: result})
    }
    getTicketInfo = async(req,res)=>{
        const username = req.session.username
        const { ticketId } = req.params; 
        const ticket = await ticketsModel.findById(ticketId);

        // Config del mail
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: process.env.USER_MAIL,
                pass: process.env.PASSWORD_MAIL
            }
        })
        // envío el mail
        const mail = await transport.sendMail({
            from:`Purchase Testing <${process.env.USER_MAIL}>`,
            to:`${username}`,
            subject:"Compra realizada exitosamente",
            html:`
            <body style="padding: 0; margin: 0;">
                <header style="width: 100%; height: 120px; display: flex; flex-direction: row; justify-content: space-between; align-items: center;background: #0F2027;  /* fallback for old browsers */; background: -webkit-linear-gradient(to right, #2C5364, #203A43, #0F2027);  /* Chrome 10-25, Safari 5.1-6 */;background: linear-gradient(to right, #2C5364, #203A43, #0F2027); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */; ">
                    <picture style="width: 100%;">
                        <img src="cid:Logo" alt="The Market Logo" style="height: 100px;">
                    </picture>
                </header>
                <main>
                    <p style="text-align: end; padding: 0 20px;">Compra en tienda The Market < ${ticket.code} ></p>
                    <h1 style="color: #252525; margin-left: 20px;">¡Gracias por tu compra!</h1>
                    <p style="margin-left: 40px; margin-top: 30px;"> Realizada por ${ticket.purchaser} el ${ticket.purchase_datetime} por un total de $${ticket.amount}<span style="color: rgb(175, 52, 52);">*</span></p>
                    <p style="margin-left: 40px;margin-top: 50px;"><span style="color: rgb(175, 52, 52);">*</span>Esta compra se trata de un test</p>
                </main>
                <footer style="height: 50px; width: 100%; background-color: #252525; color: #fafafa; display: flex; align-items: center; margin-top: 30px;"><p style="margin-left: 20px;">Equipo The Market®</p></footer>
            </body>`,
            attachments:[{
                filename: 'Logo.png',
                path:__dirname+'/../public/images/Logo.png',
                cid:'Logo'
            }]
        })
        res.json({status:'success', payload: ticket}) 
    }
}


 