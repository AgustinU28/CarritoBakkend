import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    products: {
        type:
        [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                }
            }
        ],
        default:[]
    }

});

cartsSchema.pre('find',function(){
    this.populate('products.product');
});

cartsSchema.pre('findOne',function(){
    this.populate('products.product');
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);

