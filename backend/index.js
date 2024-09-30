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

const corsOptions = {
  origin: "https://perfumz.vercel.app",
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Enable credentials
};

// Enable CORS middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: "https://perfumz.vercel.app/",
//   })
// );

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "https://perfumz.vercel.app/");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://perfumz.vercel.app/");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// // Handle preflight requests
// app.options("*", (req, res) => {
//   res.header("Access-Control-Allow-Origin", "https://perfumz.vercel.app/");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.sendStatus(200);
// });

// const corsOptions = {
//   origin: "https://perfumz.vercel.app",
//   methods: "GET,HEAD,POST,PUT,DELETE,OPTIONS",
//   allowedHeaders: "Content-Type, Authorization",
//   credentials: true,
// };

// app.use(cors(corsOptions));

app.use("/api/products", productRoute);
app.use("/api/inventory", inventoryRoute);
app.use("/api/client", clientRoute);
app.use("/api/sales", salesRoute);
app.use("/api/user", userRoute);

app.get("/test", (req, res) => {
  res.json({ message: "API is working" });
});

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server on http://localhost:3000");
  connectDb();
});
