
import crypto from 'crypto';
import utils from '../../utils.js';

export class Cart{
  constructor(){
    this.products = [];
  }
}


export class CartManager{
    carts;
    constructor(path){
        this.path = path;
        this.carts = [];
    }

    // Agregar carrito

    async addCart(){
      let cart = new Cart();
        try{
            let data =  await utils.readFile(this.path);
            this.carts = data?.length > 0 ? data : [];

            cart = {
                id: crypto.randomUUID(),
                products: []
              };
            this.carts.push(cart);

            await utils.writeFile(this.path, this.carts);
            return cart;
          } catch (error) {
            console.log(error);
        }
    }

    // Ver un carrito y sus productos

    async getCartById(id){
        try {
            let dataCarts = await utils.readFile(this.path);
            this.carts = dataCarts?.length > 0 ? dataCarts : [];
            let cart = this.carts.find(cart => cart.id == id);
      
            if (!cart) {
                throw new Error("Not found")
            } else {
                return cart;
            }
          } catch (error) {
            console.log(error);
          }
    }

    // Agregar producto a un carrito

    async addProductToCart(cid, pid, qty = 1) {
        try {
          const dataCart = await this.getCartById(cid);
          let cartIndex = this.carts.findIndex(cart => cart.id == cid);
          
          if (cartIndex !== -1) {
            let cart = this.carts[cartIndex];
            const prodIndex = cart.products.findIndex((prod) => prod.id == pid);
            if(prodIndex !== -1){
              cart.products[prodIndex].quantity += qty;
            } else {
              cart.products.push({id: pid, quantity: qty})
            }

            await utils.writeFile(this.path, this.carts);
            
            return {
              mensaje: "Producto agregado con éxito al carrito",
              carrito: this.carts[cartIndex],
            };

          } else {
            return { mensaje: "No existe el carrito" };
          }

        } catch (error) {
          console.log(error);
        }
      }
}

