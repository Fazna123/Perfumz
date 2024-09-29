import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

const client = new mongoose.model("Client", clientSchema);

export default client;
