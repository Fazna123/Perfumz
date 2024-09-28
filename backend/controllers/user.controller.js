import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import errorHandler from "../utils/error.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }
    const user = await User.findOne({ email });
    if (user) {
      return next(errorHandler(400, "This email is already registered"));
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "You have registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "Please register first"));
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return next(errorHandler(401, "Invalid credentials"));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    return res
      .status(201)
      .json({ success: true, token, message: "Login Successful" });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.status(201).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
