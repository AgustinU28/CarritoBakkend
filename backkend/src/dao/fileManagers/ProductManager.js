
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


// -------------------------------------------------------------

// Prueba del código

// const almacen = new ProductManager('./productos_almacen.json');
// const kiosko = new ProductManager('./productos_kiosko.json');

// Agrego los productos

// almacen.addProduct("Agua","Agua mineral sin gas marca: Villa del Sur, botella 500ml", 250, "Imagen1","4fx2654fx154",35);
// almacen.addProduct("Pepsi","Bebida gaseosa marca: Pepsi, botella 2.25lts", 850, "Imagen1","4fx2660fb164",100);
// almacen.addProduct("Gancia Pomelo","Bebida con alcohol sabor pomelo marca: Gancia, lata 500ml", 420, "Imagen1","5fx2560df165",100);
// almacen.addProduct("Fernet Branca","Bebida con alcohol marca: Branca, botella 1lts", 1950, "Imagen1","1bx2440db424",150);

// kiosko.addProduct("Alfajor triple","Alfajor de dulce de leche con baño de chocolate marca: Jorgito 90gr ", 250, "Imagen1","4fx2654fx5644",25);
// kiosko.addProduct("Barra de chocolate","Chocolate con leche marca: Milka 60gr", 230, "Imagen1","4fx2660dsf432",250);
// kiosko.addProduct("Gomitas surtidas","Gomitas frutales marca Yummy 50gr", 99, "Imagen1","5fxdf264df165",110);
// kiosko.addProduct("Fernet Branca","Bebida con alcohol marca Branca, botella 2lts", 3250, "Imagen1","fsdf86sdf0db44",190);


// Ver los productos

// console.log(almacen.getProducts());
// console.log(kiosko.getProducts());

// cambiar por un id Válido al momento de generar los json.
// let idProd = '5bb0e3e4-27c9-4701-b5c3-038108494bbb'
// ---------------------

// Ver un producto por id.

// console.log(almacen.getProductById(idProd));

// Actualizar un producto

// const updatedFields = {
//     title: "Agua con gas",
//     price: 290
// }

// const updatedProduct = almacen.updateProductById(idProd, updatedFields);

// console.log(almacen.getProductById(idProd));

// Borrar un producto

// console.log(almacen.deleteProductById(idProd));

