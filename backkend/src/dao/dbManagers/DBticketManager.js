import { ticketsModel } from "../models/tickets.model.js";
import crypto from 'crypto';
import { ProductManager } from "./DBproductManager.js";
import { CartManager } from "./DBcartManager.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { __dirname } from "../../utils.js";


dotenv.config();

const productManager = new ProductManager();
const cartManager = new CartManager();

export class TicketManager {
    async addTicket(data, username = 'gabriel.monlezun@gmail.com') {
        // let cart = data;
        // let products = [...cart.products];
        // let prodsTemp = [];
        // // fn para comparar igualdad entre pid
        // const equalIDs = (currProd, tmpProd) => { 
        //     if(tmpProd.product._id == currProd.product._id){
        //         return true        
        //     } else {
        //         return false
        //     }
        // }
        // // Reccorro los productos del carrito, para buscar duplicados, agrego un nuevo array de objetos para determinar cantidades y precio total
        // for (let i = 0; i < products.length; i++) {
        //     let prodIndex = prodsTemp.findIndex(prod => { if(equalIDs(products[i],prod)){ return true } })
        //     if (prodIndex == -1) {
        //         let price = products[i].product.price;
        //         prodsTemp.push({...products[i],quantity:1, price: price.toString()})
        //     } else {
        //         let newQuantity = Number(prodsTemp[prodIndex].quantity) + 1;
        //         let newPrice = Number(prodsTemp[prodIndex].price) * newQuantity;
        //         prodsTemp[prodIndex] = {...prodsTemp[prodIndex], price: newPrice.toString(), quantity: newQuantity.toString()}
        //     }
        // }
        // // arrays para separar entre aquellos productos que cuentan con stock y los que no
        // let remainingProds = [];
        // let purchasedProds = [];
        // for (let i = 0; i < prodsTemp.length; i++) {
        //     let productID = prodsTemp[i].product._id;
        //     let currProd = await productManager.getById(productID);
        //     let actualStock = currProd.stock;
        //     let quantity = prodsTemp[i].quantity;
        //     let tmpIndex = products.findIndex(prod => equalIDs(prodsTemp[i],prod))
        //     let cartProd = products[tmpIndex]
        //     // Casos, si el pedido es mayor al stock o si supera al stock actual
        //     if(actualStock - quantity > 0){
        //         let newProductStock = actualStock - quantity;
        //         await productManager.updateById(productID, {stock: newProductStock})
        //         purchasedProds.push(prodsTemp[i])
        //     } else {
        //         if(actualStock == 0){
        //             for (let i = 0; i < quantity; i++) {
        //                 remainingProds.push(cartProd) 
        //             }
        //         } else {
        //             await productManager.updateById(productID, {stock: 0})
        //             purchasedProds.push({...prodsTemp[i],quantity: actualStock})
        //             let remainQty = quantity - actualStock;
        //             for (let i = 0; i < remainQty; i++) {
        //                 remainingProds.push(cartProd)
        //             }
        //         }
        //     }
        // }
        // // Actualizo el carrito con los productos que no hay stock
        // if (remainingProds.length > 0){
        //     await cartManager.modifyArrCart(cart._id, remainingProds)
        // }
        // // Calculo el total de la compra
        // let total = 0;
        // purchasedProds.forEach(product => { total += Number(product.price) })
        // // Genero el objeto ticket   
        // let newTicket = {
        //     code: crypto.randomUUID(),
        //     purchase_datetime: new Date(),
        //     amount: total,
        //     purchaser: username
        // }

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
            subject:"Compra reservada exitosamente",
            html:`
            <body style="padding: 0; margin: 0;">
                <header style="width: 100%; height: 120px; display: flex; flex-direction: row; justify-content: space-between; align-items: center;background: #0F2027;  /* fallback for old browsers */; background: -webkit-linear-gradient(to right, #2C5364, #203A43, #0F2027);  /* Chrome 10-25, Safari 5.1-6 */;background: linear-gradient(to right, #2C5364, #203A43, #0F2027); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */; ">
                    <picture style="width: 100%;">
                        <img src="cid:Logo" alt="The Market Logo" style="height: 100px;">
                    </picture>
                </header>
                <main>
                    <p style="text-align: end; padding: 0 20px;">Compra en tienda The Market < ${newTicket.code} ></p>
                    <h1 style="color: #252525; margin-left: 20px;">¡Gracias por tu compra!</h1>
                    <p style="margin-left: 40px; margin-top: 30px;"> Realizada por ${newTicket.purchaser} el ${newTicket.purchase_datetime} por un total de $${newTicket.amount}<span style="color: rgb(175, 52, 52);">*</span></p>
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
        // const res = await ticketsModel.create(newTicket);
        return {response: res};
    }
}