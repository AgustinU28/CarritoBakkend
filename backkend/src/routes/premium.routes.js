import { Router } from "express";
import { PremiumProductsController } from "../controllers/premium.controller.js";
import { authPremium } from "./session.routes.js";

const router = Router();

const premiumProductsController = new PremiumProductsController()

router.get("/", authPremium, premiumProductsController.getAll);

export default router;
