import express from "express";
import {
  addInventory,
  getInventoryDetails,
} from "../controllers/inventory.controller.js";

const router = express.Router();

router.get("/get-details", getInventoryDetails);
router.put("/add-stock/:id", addInventory);

export default router;
