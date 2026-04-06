import mongoose from "mongoose";
import Item from "../models/item.js";

// CREATE ITEM (Supports Custom String User-ID)
export const createItem = async (req, res) => {
  try {
    const { title, description, category, color, status, location, image_url } = req.body;

    // Handle both user_id or userId formats from the frontend
    const incomingUserId = req.body.user_id || req.body.userId;

    // Fetch the most recent item to generate the next unique ID
    const lastItem = await Item.findOne().sort({ createdAt: -1 });

    let newNumber = 1;
    if (lastItem && lastItem.itemId) {
      const lastNumber = parseInt(lastItem.itemId.replace("ITEM", ""));
      if (!isNaN(lastNumber)) {
        newNumber = lastNumber + 1;
      }
    }

    // Format new unique ID (e.g., ITEM001, ITEM002...)
    const itemId = `ITEM${String(newNumber).padStart(3, "0")}`;

    // Create item without strict ObjectId validation to allow custom string IDs (e.g., "USR-123")
    const item = await Item.create({
      itemId,
      title,
      description,
      category,
      color,
      status,
      location,
      image_url,
      user_id: incomingUserId || null,
    });

    res.status(201).json({
      message: "Item created successfully",
      data: item,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Duplicate Item ID detected. Please try submitting again." 
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// GET ALL APPROVED ITEMS (For Public Feed)
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({ isDeleted: false, isApproved: true }).sort({ createdAt: -1 });

    res.status(200).json({
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PENDING ITEMS (For Admin Dashboard Only)
export const getPendingItems = async (req, res) => {
  try {
    const items = await Item.find({ isDeleted: false, isApproved: false }).sort({ createdAt: -1 });

    res.status(200).json({
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPROVE ITEM (Admin Action - using MongoDB _id)
export const approveItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item approved and added to live feed",
      data: item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE ITEM (using MongoDB _id)
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item || item.isDeleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ITEM (using MongoDB _id)
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item updated successfully",
      data: item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ITEM (Permanently - using MongoDB _id)
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item permanently deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};