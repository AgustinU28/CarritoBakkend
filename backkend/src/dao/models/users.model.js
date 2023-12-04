import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, max: 100 },
  last_name: { type: String, required: true, max: 100 },
  fullname: { type: String, max: 100 },
  email: { type: String, required: true, max: 100, unique: true },
  age: { type: Number, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  currentCartID: {type: String, max:100, default:""},
  role:{type: String, max:100, default:"user"},
  createdAt:{type: Date},
  documents:{type: [
    {
      name: {type: String},
      category: {type: String},
      reference:{type: String}
    }
  ], default:[]},
  last_connection:{type: Date}
});

const User = mongoose.model(userCollection, userSchema);

export default User;
