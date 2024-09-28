import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

const product = mongoose.model("Product", productSchema);

export default product;
