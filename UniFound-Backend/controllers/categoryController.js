import mongoose from "mongoose";
import Category from "../models/category.js";

// CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    // Fetch the most recent category to generate the next unique ID
    const lastCategory = await Category.findOne().sort({ createdAt: -1 });

    let newNumber = 1;
    if (lastCategory && lastCategory.categoryId) {
      const lastNumber = parseInt(lastCategory.categoryId.replace("CAT", ""));
      if (!isNaN(lastNumber)) {
        newNumber = lastNumber + 1;
      }
    }

    // Format new unique ID (e.g., CAT001, CAT002...)
    const categoryId = `CAT${String(newNumber).padStart(3, "0")}`;

    // Create category
    const category = await Category.create({
      categoryId,
      name,
      description,
      color: color || "blue",
      icon: icon || "📦",
      itemCount: 0,
    });

    res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Duplicate Category ID detected. Please try submitting again." 
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// GET ALL CATEGORIES
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false }).sort({ createdAt: -1 });

    res.status(200).json({
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE CATEGORY
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || category.isDeleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE CATEGORY (Soft Delete)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE CATEGORY ITEM COUNT
export const updateCategoryItemCount = async (req, res) => {
  try {
    const { increment } = req.body; // true to increment, false to decrement
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const newCount = increment 
      ? category.itemCount + 1 
      : Math.max(0, category.itemCount - 1);

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { itemCount: newCount },
      { new: true }
    );

    res.status(200).json({
      message: "Category item count updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ACTIVE CATEGORIES (for dropdowns/forms)
export const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ 
      isDeleted: false, 
      isActive: true 
    }).sort({ name: 1 });

    res.status(200).json({
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
