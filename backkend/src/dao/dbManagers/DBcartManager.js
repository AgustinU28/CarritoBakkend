import { cartsModel } from "../models/carts.model.js";
export class CartManager {

    async getById(id) {
      return await cartsModel.findOne({ _id: id }).lean();
    }
    async add() {
      const res = await cartsModel.create({products: []});
      return res;
    }
    async addProductToCart(cart, pid) {
      const res = await cartsModel.findByIdAndUpdate(
        cart._id,
        { $push: { products: { product: pid } } },
        { new: true }
      );
      return res;
    };
    async deleteById(id){
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
    async updateProductOfCart(cid, pid, qty) {
      let res;
      let arrayOfProducts = [];
      for (let i = 0; i < qty; i++) {
        arrayOfProducts.push({product: pid})      
      }
      console.log({arrayOfProducts})
      res += await cartsModel.findByIdAndUpdate(
      cid,
      { $push: { products: { $each: arrayOfProducts } } },
      { new: true }
      );
      return res;
    }
    async updateManyProductsOfCart(cid, newProducts){  
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
  
 