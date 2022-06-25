import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  token: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  userVerified: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
  },
});

const usersModel = new mongoose.model("Users", userSchema, "users");

export default usersModel;
