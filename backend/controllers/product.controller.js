import Product from "../models/product.model.js";
import errorHandler from "../utils/error.js";

export const addProduct = async (req, res, next) => {
  try {
    const { name, brand, category, description, price } = req.body;
    const isExist = await Product.findOne({ name });
    if (isExist) {
      return next(errorHandler(409, "Product Already Exists"));
    }
    const newProduct = new Product({
      name,
      brand,
      category,
      description,
      price,
    });
    await newProduct.save();
    return res.status(201).json({
      success: true,
      product: newProduct,
      message: "Product Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    return res
      .status(200)
      .json({ success: true, products, message: "Products fetched" });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { name, price, brand, category, description } = req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      { name, brand, price, category, description },
      { new: true }
    );
    return res
      .status(201)
      .json({ success: true, product, message: "Product updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const isDeleted = await Product.findByIdAndDelete(productId);
    if (isDeleted) {
      return res
        .status(200)
        .json({ success: true, message: "Product deleted" });
    }
  } catch (error) {
    next(error);
  }
};
