import { Router } from "express";
import { __dirname } from "../utils.js";
import { authAdmin } from "./session.routes.js";
import { RealTimeProductController } from "../controllers/realtimeProducts.controller.js";

const router = Router();
const realTimeProductController = new RealTimeProductController()
router.get('/', authAdmin, realTimeProductController.realTime)

export default router;
