import { Router } from "express";
import { ProductManager } from "../dao/dbManagers/DBproductManager.js";
import { __dirname } from "../utils.js";
import { authPremium } from "./session.routes.js";

const premiumRouter = Router();

const productManager = new ProductManager()

premiumRouter.get("/", authPremium, async (req, res) => {
  const user = req.session.username;
  const products = await productManager.getProductsRealtime();
  res.render("premium", { products, user });
});

export default premiumRouter;
