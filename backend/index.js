import express from "express";
import dotenv from "dotenv";

import cors from "cors";

import productRoute from "./routes/product.route.js";
import inventoryRoute from "./routes/inventory.route.js";
import clientRoute from "./routes/client.route.js";
import userRoute from "./routes/user.route.js";
import salesRoute from "./routes/sales.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";

import connectDb from "./config/db.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors());

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/products", productRoute);
app.use("/api/inventory", inventoryRoute);
app.use("/api/client", clientRoute);
app.use("/api/sales", salesRoute);
app.use("/api/user", userRoute);

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server on http://localhost:3000");
  connectDb();
});
