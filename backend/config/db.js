import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected to mongodb");
    })
    .catch((error) => console.log(error));
};

export default connectDb;
