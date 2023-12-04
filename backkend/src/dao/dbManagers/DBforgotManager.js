import { ForgotModel } from "../models/forgot.model.js";

export class ForgotManager{
    async assignForgot(forgotObj){
        return await ForgotModel.create(forgotObj)
    }
    async searchCode(code){
        let now = ((new Date().getTime())/1000)/60;
        let codeExist = await ForgotModel.findOne({code: code})
        if(!codeExist){
            return false;
        }
        const createdAt = ((new Date(codeExist.createdAt).getTime())/1000)/60;
        if ((now - createdAt) < 10){
            return true
        } else {
            await ForgotModel.findOneAndDelete({_id : codeExist._id})
            return false
        }
    }
}