import express from "express";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import authVerify from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", authVerify, addProduct);
router.get("/fetch", authVerify, getProducts);
router.put("/update/:id", authVerify, updateProduct);
router.delete("/delete/:id", authVerify, deleteProduct);

export default router;
