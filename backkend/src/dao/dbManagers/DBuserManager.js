import UserModel from "../models/users.model.js";

export class UserManager{
    async setCartID(email, cartID){
        return await UserModel.findOneAndUpdate(
            { email: email }, 
            { $set: { 'currentCartID': cartID } }, 
            { new: true }
        )
    }
}