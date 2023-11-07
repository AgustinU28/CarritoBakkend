import { ProductManager } from "../dao/dbManagers/DBproductManager.js";

const productManager = new ProductManager()

export class RealTimeProductController {  
    realTime = async (req, res) =>{
        const products = await productManager.getRealtime();
        // return res.status(200).json({products})
        return res.status(200).render('realtimeproducts', {products})
    }
}
