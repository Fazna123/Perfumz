import Sales from "../models/sales.model.js";
import Product from "../models/product.model.js";
import Client from "../models/client.model.js";
import Inventory from "../models/inventory.model.js";

export const getSalesDetails = async (req, res, next) => {
  try {
    const salesData = await Sales.find()
      .populate({
        path: "productId",
        select: "name",
      })
      .populate({
        path: "clientId",
        select: "email",
      })
      .select("soldUnitsQuantity createdAt")
      .sort({ createdAt: -1 });

    const formattedSalesData = salesData.map((sale) => ({
      _id: sale._id,
      productName: sale.productId.name,
      clientEmail: sale.clientId.email,
      soldUnits: sale.soldUnitsQuantity,
      purchasedDate: sale.createdAt,
    }));
    return res.status(200).json({
      success: true,
      salesData: formattedSalesData,
      message: "Sales Data fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const addSalesData = async (req, res, next) => {
  try {
    const { productName, clientEmail, soldUnits } = req.body;
    const product = await Product.findOne({ name: productName });
    if (!product) {
      return next(errorHandler(404, "Unavailable Product"));
    }
    let client = await Client.findOne({ email: clientEmail });
    if (!client) {
      client = new Client({
        email: clientEmail,
      });
      await client.save();
    }
    const newSalesData = new Sales({
      productId: product._id,
      clientId: client._id,
      soldUnitsQuantity: soldUnits,
    });
    await newSalesData.save();
    const inventoryData = await Inventory.findOne({ productId: product._id });
    const inventoryUpdate = await Inventory.findByIdAndUpdate(
      inventoryData._id,
      { $inc: { quantity: -soldUnits } },
      { new: true }
    );
    return res.status(201).json({
      success: true,
      salesData: newSalesData,
      inventoryUpdate,
      message: "new sales record added and updated the inventory",
    });
  } catch (error) {
    next(error);
  }
};

export const editSalesData = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { soldUnits, productName } = req.body;
    const product = await Product.findOne({ name: productName });
    const inventoryData = await Inventory.findOne({ productId: product._id });
    let quantity = inventoryData.quantity;
    const salesData = await Sales.findById(id);
    if (salesData.soldUnitsQuantity > soldUnits) {
      let val = salesData.soldUnitsQuantity - soldUnits;
      quantity += val;
    } else if (salesData.soldUnitsQuantity < soldUnits) {
      let val = soldUnits - salesData.soldUnitsQuantity;
      quantity -= val;
    }
    const salesUpdate = await Sales.findByIdAndUpdate(
      id,
      { soldUnitsQuantity: soldUnits },
      { new: true }
    );
    const inventoryUpdate = await Inventory.findByIdAndUpdate(
      inventoryData._id,
      { quantity },
      { new: true }
    );
    if (salesUpdate && inventoryUpdate) {
      return res.status(201).json({
        success: true,
        salesData: salesUpdate,
        message: "sales details updated",
      });
    } else {
      return next(
        errorHandler(500, "Failed to update sales or inventory data")
      );
    }
  } catch (error) {
    next(error);
  }
};

export const deleteSalesData = async (req, res, next) => {
  try {
    const id = req.params.id;
    const salesData = await Sales.findById(id);
    if (!salesData) {
      return next(errorHandler(404, "Sales data not found"));
    }
    const inventoryData = await Inventory.findOne({
      productId: salesData.productId,
    });
    if (!inventoryData) {
      return next(errorHandler(404, "Inventory not found for the product"));
    }
    const inventoryUpdate = await Inventory.findByIdAndUpdate(
      inventoryData._id,
      { $inc: { quantity: salesData.soldUnitsQuantity } },
      { new: true }
    );
    const salesDelete = await Sales.findByIdAndDelete(id);
    if (inventoryUpdate && salesDelete) {
      return res.status(204).json({
        success: true,
        message: "Sales data deleted and inventory updated",
      });
    } else {
      return next(
        errorHandler(500, "Failed to delete sales data or update inventory")
      );
    }
  } catch (error) {
    next(error);
  }
};
