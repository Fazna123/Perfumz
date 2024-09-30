import express from "express";
import {
  addSalesData,
  deleteSalesData,
  editSalesData,
  getSalesDetails,
  totalSales,
} from "../controllers/sales.controller.js";

const router = express.Router();

router.get("/get-sales", getSalesDetails);
router.post("/add-sales", addSalesData);
router.put("/edit-sales/:id", editSalesData);
router.delete("/delete-sales/:id", deleteSalesData);
router.get("/total-sales", totalSales);

export default router;
