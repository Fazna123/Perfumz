import express from "express";
import {
  addClient,
  deleteClient,
  getClients,
  updateClient,
} from "../controllers/client.controller.js";

const router = express.Router();

router.get("/get-clients", getClients);
router.post("/add-client", addClient);
router.put("/update-client/:id", updateClient);
router.delete("/delete-client/:id", deleteClient);

export default router;
