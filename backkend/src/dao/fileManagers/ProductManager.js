
import crypto from 'crypto';
import utils from '../utils.js';

export class ProductManager{
    products;
    // static id = 0;
    constructor(path){
        this.path = path;
        this.products = [];
    }

    // Ver todos los productos
    async getProducts(sortProd, value){
      try {
          let data = await utils.readFile(this.path);
          this.products = data?.length > 0 ? data : [];
          let filteredProducts = []
          this.products.forEach(product=>{
            if(product.title == value || product.category == value || product.description == value) {
              filteredProducts.push(product)
            }
          })
          if(filteredProducts.length>1){
            return filteredProducts;
          }
          return this.products;
        } catch (error) {
          console.log(error);
        }
    }
    // Agregar producto

    async addProduct(title, description, price, code, stock, thumbnail){
        if (!title || !description || !price || !stock) {
            throw new Error("Error: debés completar todos los campos del producto a agregar")  
        }
        if (thumbnail == "") {
          thumbnail = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";
        }
        try{
            let data =  await utils.readFile(this.path);
            this.products = data?.length > 0 ? data : [];
            } catch (error) {
            console.log(error);
        }

        let codeRepeated = this.products.findIndex(prod => prod.code == code);

        if (codeRepeated != -1) {
            throw new Error(`El código ya existe en el producto: ${this.products[codeRepeated].title}`)
        }

        const product = {
            id: crypto.randomUUID(),
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        };

        this.products.push(product);

        try {
            await utils.writeFile(this.path, this.products);
          } catch (error) {
            console.log(error);
          }
    }



    // Ver un producto
    async getProductById(id){
        try {
            let dataproducts = await utils.readFile(this.path);
            this.products = dataproducts?.length > 0 ? dataproducts : [];
            let product = this.products.find(prod => prod.id == id);
      
            if (!product) {
                throw new Error("Not found")
            } else {
                return product;
            }
          } catch (error) {
            console.log(error);
          }
    }

    // Actualizar producto

    async updateProductById(id, updatedFields) {
        try {
          const dataproducts = await this.getProducts();
          this.products = dataproducts?.length > 0 ? dataproducts : [];
          let productIndex = this.products.findIndex(product => product.id === id);
          
          if (productIndex !== -1) {
            this.products[productIndex] = {
              ...this.products[productIndex],
              ...updatedFields,
            };

            await utils.writeFile(this.path, this.products);
            
            return {
              mensaje: "Producto actualizado",
              producto: this.products[productIndex],
            };

          } else {
            return { mensaje: "No existe el producto solicitado" };
          }

        } catch (error) {
          console.log(error);
        }
      }

    async deleteProductById(id) {
          let dataproducts = await utils.readFile(this.path);
          this.products = dataproducts?.length > 0 ? dataproducts : [];
          
          let productIndex = this.products.findIndex(prod => prod.id === id);
         
          if (productIndex !== -1) {
            let product = this.products[productIndex];
            this.products.splice(productIndex, 1);
            utils.writeFile(this.path, this.products);
            return { mensaje: "Producto eliminado", producto: product };
          }  
            
          return { mensaje: "No existe el producto solicitado" };
    }
}



