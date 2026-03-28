import Item from "../models/item.js";

// ✅ CREATE ITEM (Updated with robust Auto-ID Logic)
export const createItem = async (req, res) => {
  try {
    const { title, description, category, color, status, location, image_url, user_id } = req.body;

    // 1. Database eke thiyena anthimata dapu item eka ganna (Created date eka anuwa sort karala)
    const lastItem = await Item.findOne().sort({ createdAt: -1 });

    let newNumber = 1;
    if (lastItem && lastItem.itemId) {
      // "ITEM011" kiyana eken numbers tika witharak wen karala ganna
      const lastNumber = parseInt(lastItem.itemId.replace("ITEM", ""));
      if (!isNaN(lastNumber)) {
        newNumber = lastNumber + 1;
      }
    }

    // 2. Aluth unique ID eka hadanna (e.g., ITEM012)
    const itemId = `ITEM${String(newNumber).padStart(3, "0")}`;

    const item = await Item.create({
      itemId,
      title,
      description,
      category,
      color,
      status,
      location,
      image_url,
      // Frontend payload eken user_id ganna, nathnam auth middleware eken req.user.id ganna
      user_id: user_id || req.user?.id || null, 
    });

    res.status(201).json({
      message: "Item created successfully",
      data: item,
    });
  } catch (error) {
    // Duplicate Key Error (E11000) eka awoth pahadiwa dhenna
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Duplicate Item ID detected. Please try submitting again." 
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL ITEMS
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

// ✅ DELETE ITEM (Permanently)
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