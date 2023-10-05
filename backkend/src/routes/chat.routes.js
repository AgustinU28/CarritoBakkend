import { Router } from "express";
import { MessageManager } from "../dao/dbManagers/DBmessageManager.js";
import { __dirname } from "../utils.js";
import { authUser } from "./session.routes.js";

const chatRouter = Router();

const messageManager = new MessageManager()

chatRouter.get("/", authUser, async (req, res) => {
  if(req.session.role === 'admin'){
    res.redirect('/realtimeproducts')
  }
  const messages = await messageManager.getMessages();
  res.render("chat", { messages });
});

export default chatRouter;
