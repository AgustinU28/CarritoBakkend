import { messagesModel } from "../models/messages.model.js";

export class MessageManager {
    async getMessages() {
      return await messagesModel.find({}).lean();
    }
  
    async addMessage(user,data) {
      const res = messagesModel.create({user:user, message:data});
      return res;
    }
  
  }
  