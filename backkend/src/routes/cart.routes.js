import { Router } from "express";
import { CartController } from "../controllers/cart.controller.js";

const router = Router();
const cartController = new CartController()

router.get('/:cid', cartController.getById)
router.get('/:cid/totalprods', cartController.totalProds)
router.post('/', cartController.add)
router.post('/:cid/product/:pid', cartController.addProductToCart)
router.delete('/:cid', cartController.delete)
router.delete('/:cid/product/:pid', cartController.deleteProductOfCart)
router.put('/:cid/product/:pid', cartController.updateProductOfCart)
router.put('/:cid', cartController.updateManyProductsOfCart)
router.get('/:cid/purchase', cartController.generateTicket)

export default router;