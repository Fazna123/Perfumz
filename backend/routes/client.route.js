import express from "express";
import {
  addClient,
  deleteClient,
  getClients,
  updateClient,
} from "../controllers/client.controller.js";
import authVerify from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/get-clients", authVerify, getClients);
router.post("/add-client", authVerify, addClient);
router.put("/update-client/:id", authVerify, updateClient);
router.delete("/delete-client/:id", authVerify, deleteClient);

export default router;
