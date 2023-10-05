import { cartsModel } from "../models/carts.model.js";

export class CartManager {

    async getCartById(id) {
      return await cartsModel.findOne({ _id: id }).lean();
    }
  
    async addCart() {
      const res = await cartsModel.create({products: []});
      return res;
    }
  
    async addProductToCart(cart, pid) {
      
      if (!cart) {
        throw new Error("Cart no encontrado"); 
      }
    
      const res = await cartsModel.findByIdAndUpdate(
        cart._id,
        { $push: { products: { product: pid } } },
        { new: true }
      );
      return res;
    }
    

    async deleteCartById(id){
      const res = await cartsModel.findByIdAndDelete(id);
      return res;
    };

    async deleteProductOfCart(cid, pid){
      const cart = await cartsModel.findById(cid);
      const res = await cartsModel.findByIdAndUpdate(
         cart ,
        { $pull: { products: {productId : pid } } },
        { new: true }
      )
      return res;
    }

    async updateQtyProdCart(cid, pid, qty) {

        const res = await cartsModel.findOneAndUpdate(
          { _id: cid, 'products.productId': pid }, 
          { $set: { 'products.$.quantity': qty } }, 
          { new: true }
        );   
      return res;
    }

    async updateArrCart(cid, newProducts){  
      const cart = await cartsModel.findById(cid);
      const res = await cartsModel.findByIdAndUpdate(
          cart._id,
          {$push: {
            products: {
              $each: [...newProducts]  
            }
          }},
          { new: true }
        );
        return res;
    }

    async modifyArrCart(cid, products){
      const cart = await cartsModel.findById(cid);
      const res = await cartsModel.findByIdAndUpdate(
          cart._id,
          {$set:{
            'products': products
          }}
      )
      return res;
    }

  }
  
 