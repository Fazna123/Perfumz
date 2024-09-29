import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    soldUnitsQuantity: {
      type: Number,
    },
  },
  { timestamps: true }
);

const sales = new mongoose.model("Sales", salesSchema);

export default sales;
