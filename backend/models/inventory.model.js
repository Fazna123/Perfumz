import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      unique: true,
    },
    quantity: {
      type: Number,
    },
  },
  { timestamps: true }
);

const inventory = new mongoose.model("Inventory", inventorySchema);

export default inventory;
