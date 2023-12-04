import mongoose from "mongoose";

const forgotCollection = "forgot";

const forgotSchema = new mongoose.Schema({
  email: { type: String, required: true, max: 100 },
  code: { type: String },
  createdAt:{ type: Date }
});

export const ForgotModel = mongoose.model(forgotCollection, forgotSchema);

