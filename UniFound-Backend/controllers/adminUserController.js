import AdminUser from "../models/adminUser.js";
import bcrypt from "bcrypt";

// 🔹 Create Admin User
export const createAdminUser = async (req, res) => {
  try {
    const { fullName, email, password, role, status } = req.body;

    // Check existing email
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new AdminUser({
      fullName,
      email,
      password: hashedPassword,
      role,
      status,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create admin user",
    });
  }
};

// 🔹 Get all admin users
export const getAdminUsers = async (req, res) => {
  try {
    const users = await AdminUser.find().select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};

// 🔹 Update admin user
export const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, role, status } = req.body;

    const updatedUser = await AdminUser.findByIdAndUpdate(
      id,
      { fullName, role, status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

// 🔹 Delete admin user
export const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;

    await AdminUser.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};