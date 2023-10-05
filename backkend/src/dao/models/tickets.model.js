import mongoose from "mongoose";

const ticketsCollection = "tickets";

const ticketsSchema = new mongoose.Schema({
    code:{
        type: String,
        unique: true,
    },
    purchase_datetime: Date,
    amount: Number,
    purchaser: String,
});


export const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);