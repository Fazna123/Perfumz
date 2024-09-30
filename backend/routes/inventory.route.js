import express from "express";
import {
  addInventory,
  getInventoryDetails,
} from "../controllers/inventory.controller.js";
import authVerify from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/get-details", authVerify, getInventoryDetails);
router.put("/add-stock/:id", authVerify, addInventory);

export default router;
