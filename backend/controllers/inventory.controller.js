import Inventory from "../models/inventory.model.js";

export const getInventoryDetails = async (req, res, next) => {
  try {
    const stockData = await Inventory.find().populate({
      path: "productId",
      select: "name",
    });

    const newStockData = stockData.map((item) => ({
      _id: item._id,
      productName: item.productId ? item.productId.name : "", // Handle null productId
      quantity: item.quantity,
    }));

    return res.status(200).json({
      success: true,
      stocks: newStockData,
      message: "Inventory Details fetched",
    });
  } catch (error) {
    next(error);
  }
};

export const addInventory = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const id = req.params.id;
    const isExist = await Inventory.findByIdAndUpdate(
      id,
      { quantity: quantity },
      { new: true }
    );
    if (isExist) {
      //   const updated = await Inventory.findByIdAndUpdate(
      //     isExist._id,
      //     { $inc: { quantity: quantity } },
      //     { new: true }
      //   );
      return res
        .status(201)
        .json({ success: true, inventory: isExist, message: "Stock Updated" });
    } else {
      return res.status(404).json({
        success: false,
        message: "Product not found in list",
      });
    }
  } catch (error) {
    next(error);
  }
};
