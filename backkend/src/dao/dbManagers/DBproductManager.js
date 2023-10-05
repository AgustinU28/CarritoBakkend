import { productsModel } from "../models/products.model.js";

export class ProductManager {
  async getProducts(limitProd, pageProd, sortProd, value) {
      if (value == "Inicio") {
        value = ""
      }
      let options;
      sortProd != 0 ? options = {limit:limitProd, page:pageProd, sort: { price: sortProd }, lean: true} : options = {limit:limitProd, page:pageProd, lean:true};
  
      try{
        let response;
        if (value) {
          response = await productsModel.paginate({title: {$regex: `${value}`, $options: 'i'}},options)
          if (response.docs.length == 0) {
            response = await productsModel.paginate({category: {$regex: `${value}`, $options: 'i'}},options)
          }
        } else {
          response = await productsModel.paginate({},options)
        }
        return {response , sortProd};
      } catch {
        e => console.log(e)
      }
      
    }
    async getProductsRealtime(){
      return await productsModel.find({}).lean();
    }
    async getProductById(id) {
      return await productsModel.findOne({ _id: id });
    }
  
    async addProduct(data) {
      const res = await productsModel.create(data);
      return res;
    }
  
    async updateProductById(id, data) {
      const res = await productsModel.findByIdAndUpdate(id, data);
      return res;
    };

    async deleteProductById(id){
      const res = await productsModel.findByIdAndDelete(id);
      return res;
    };
  }
  