import Item from "../models/item.js";

// CREATE ITEM
export const createItem = async (req, res) => {
  try {
    const { title, description, category, color, status, location, image_url } = req.body;

    // Generate auto itemId
    const count = await Item.countDocuments();
    const itemId = `ITEM${String(count + 1).padStart(3, "0")}`;

    const item = await Item.create({
      itemId,
      title,
      description,
      category,
      color,
      status,
      location,
      image_url,
      user_id: req.user?.id || null,
    });

    res.status(201).json({
      message: "Item created successfully",
      data: item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ITEMS
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({ isDeleted: false }).sort({ createdAt: -1 });

    res.status(200).json({
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET SINGLE ITEM
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findOne({ itemId: req.params.id });

    if (!item || item.isDeleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE ITEM
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findOneAndUpdate(
      { itemId: req.params.id },
      { ...req.body },
      { new: true }
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

//delete
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({
      itemId: req.params.id,
    });

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