import { Router } from "express";
import { authUser, authAdmin, authPremium } from "./session.routes.js";
import { ProductController } from "../controllers/products.controller.js";

const router = Router();
const productController = new ProductController();
router.get('/', authUser, productController.getAll)
router.get('/:pid', authUser, productController.getById)
router.post('/', authPremium, productController.add)
router.put('/:pid', authPremium, productController.update)
router.delete('/:pid', authPremium, productController.delete)

export default router;