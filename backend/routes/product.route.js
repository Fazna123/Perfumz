import express from "express";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import authVerify from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", addProduct);
router.get("/fetch", getProducts);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
