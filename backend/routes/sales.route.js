import express from "express";
import {
  addSalesData,
  deleteSalesData,
  editSalesData,
  getSalesDetails,
  totalSales,
} from "../controllers/sales.controller.js";
import authVerify from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/get-sales", authVerify, getSalesDetails);
router.post("/add-sales", authVerify, addSalesData);
router.put("/edit-sales/:id", authVerify, editSalesData);
router.delete("/delete-sales/:id", authVerify, deleteSalesData);
router.get("/total-sales", authVerify, totalSales);

export default router;
