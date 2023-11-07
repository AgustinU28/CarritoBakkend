import { ProductManager } from "../dao/dbManagers/DBproductManager.js";

const productManager = new ProductManager()

export class PremiumProductsController {  
    getAll = async (req, res) =>{
        const user = req.session.username;
        const products = await productManager.getRealtime();
        // return res.status(200).json({products})
        return res.status(200).render('premium', {products, user})
    }
}
