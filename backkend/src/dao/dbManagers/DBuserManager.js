import UserModel from "../models/users.model.js";

export class UserManager{
    async setCartID(email, cartID){
        return await UserModel.findOneAndUpdate(
            { email: email }, 
            { $set: { 'currentCartID': cartID } }, 
            { new: true }
        )
    }
    async changeRol(id){
        const user = await UserModel.findById(id);
        if(user.role == 'user'){
            user.role = 'premium'
        } else {
            user.role = 'user';
        }
        user.save()
        return user;
    }
    async setConectionTime(id){
        const user = await UserModel.findById(id);
        let now = new Date();
        user.last_connection = now;
        user.save();
        return user;
    }
    async getUserById(id){
        const user = await UserModel.findById(id);
        return user;
    }

    async uploadDocumentUser(id, fieldname, category, filePath){
        try {
            const res = await UserModel.findByIdAndUpdate(
                id,
                { $push: { documents: { name: fieldname, reference: filePath, category: category } } },
                { new: true }
              );
            return res;
        } catch (error) {
            console.log(error)
        }

    }
}