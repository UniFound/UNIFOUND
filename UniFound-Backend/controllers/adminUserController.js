import AdminUser from "../models/adminUser.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Get all admin users
export const getAdminUsers = async (req, res) => {
  try {
    const users = await AdminUser.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users: users
    });

  } catch (error) {
    console.error("Error fetching admin users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin users"
    });
  }
};

// Create admin user
export const createAdminUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, status, profilePicture } = req.body;

    // Check if email already exists
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered."
      });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Generate sequential userId (USR-001, USR-002, etc.)
    const lastUser = await AdminUser.findOne().sort({ createdAt: -1 });
    const lastIdNumber = lastUser ? parseInt(lastUser.userId.split("-")[1]) : 0;
    const newIdNumber = (lastIdNumber + 1).toString().padStart(3, "0");
    const userId = `USR-${newIdNumber}`;

    // Create admin user
    const user = new AdminUser({
      userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "customer",
      status: status || "active",
      profilePicture: profilePicture || ""
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error("Admin user creation failed:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Admin user not created."
    });
  }
};

// Update admin user
export const updateAdminUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, role, status } = req.body;

    const user = await AdminUser.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) {
      const existingUser = await AdminUser.findOne({ email, userId: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already registered."
        });
      }
      user.email = email;
    }
    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Admin user updated successfully",
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error("Error updating admin user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update admin user"
    });
  }
};

// Delete admin user
export const deleteAdminUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await AdminUser.deleteOne({ userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin user deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting admin user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete admin user"
    });
  }
};
