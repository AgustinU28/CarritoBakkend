import { productsModel } from "../models/products.model.js";

export class ProductManager {
  async getAll( limit = 10, page = 1, sorted = 1, search = "" ) {
      if (search == "Inicio") {
        search = ""
      }
      if(search == 'undefined' || search == 'null'){
        search = ""
      }
      let options;
      sorted != 0 ? options = {limit:limit, page:page, sort: { price: sorted }, lean: true} : options = {limit:limit, page:page, lean:true};
      try{
        let response;
        if (search) {
          response = await productsModel.paginate({title: {$regex: `${search}`, $options: 'i'}},options)
          if (response.docs.length == 0) {
            response = await productsModel.paginate({category: {$regex: `${search}`, $options: 'i'}},options)
          }
        } else {
          response = await productsModel.paginate({},options)
        }
        return response;
      } catch {
        e => console.log(e)
      }
      
    }
    async getById(pid) {
      return await productsModel.findOne({ _id: pid });
    }
    async getByCode(code) {
      return await productsModel.findOne({ code: code });
    }
    async add(product) {
      const res = await productsModel.create(product);
      return res;
    }
    async updateById(id, data) {
      const res = await productsModel.findByIdAndUpdate(id, data);
      return res;
    };
    async deleteById(id){
      const res = await productsModel.findByIdAndDelete(id);
      return res;
    };
    async getRealtime(){
      return await productsModel.find({}).lean();
    }
  }
  