import Inventory from "../models/inventory.model.js";
import Product from "../models/product.model.js";
import errorHandler from "../utils/error.js";

export const addProduct = async (req, res, next) => {
  try {
    const { name, brand, category, description, price, quantity } = req.body;
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
    const productAdded = await newProduct.save();
    const newInventory = new Inventory({
      productId: productAdded._id,
      quantity,
    });
    await newInventory.save();
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
    // const inventoryUpdate = await Inventory.findOne({ productId });
    // const updated = await Inventory.findByIdAndUpdate(
    //   inventoryUpdate._id,
    //   { $inc: { quantity: quantity } },
    //   { new: true }
    // );
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
    const inventoryUpdate = await Inventory.deleteOne({ productId });
    if (isDeleted && inventoryUpdate) {
      return res
        .status(200)
        .json({ success: true, message: "Product deleted" });
    }
  } catch (error) {
    next(error);
  }
};
