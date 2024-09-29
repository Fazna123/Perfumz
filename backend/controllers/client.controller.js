import Client from "../models/client.model.js";
import errorHandler from "../utils/error.js";

export const addClient = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;
    const isExists = await Client.findOne({ email });
    if (isExists) {
      return next(errorHandler(409, "Client is added already"));
    }
    const newClient = new Client({
      name,
      email,
      phone,
      address,
    });
    await newClient.save();
    return res.status(201).json({
      success: true,
      client: newClient,
      message: "new client data added",
    });
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, email, phone, address } = req.body;
    const updateData = await Client.findByIdAndUpdate(
      id,
      { name, email, phone, address },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      client: updateData,
      message: "Client details updated",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    const id = req.params.id;
    const isDeleted = await Client.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Client Details are deleted" });
  } catch (error) {
    next(error);
  }
};

export const getClients = async (req, res, next) => {
  try {
    const clientData = await Client.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      clientData,
      message: "Client Data fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
