import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
dotenv.config()

export const getUser = async (req, res) => {
  try {
    // Fetch all users, hide passwords
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users: users
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, type, profilePicture, role, status } = req.body;

    // 1️⃣ Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered."
      });
    }

    // 2️⃣ Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // 3️⃣ Generate sequential userId (USR-001, USR-002, etc.)
    const lastUser = await User.findOne().sort({ createdAt: -1 }); // last inserted user
    const lastIdNumber = lastUser ? parseInt(lastUser.userId.split("-")[1]) : 0;
    const newIdNumber = (lastIdNumber + 1).toString().padStart(3, "0");
    const userId = `USR-${newIdNumber}`;

    // 4️⃣ Create user WITHOUT admin/public check
    const user = new User({
      userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      type: type || "customer", // default customer
      profilePicture: profilePicture || ""
    });
    
    // Add role and status if provided (for admin users)
    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    // 5️⃣ Response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error("User creation failed:", error);
    res.status(500).json({
      success: false,
      message: error.message || "User not created."
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, role, status } = req.body;

    // Find user by userId
    const user = await User.findOne({ userId });
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
      // Check if email already exists for another user
      const existingUser = await User.findOne({ email, userId: { $ne: userId } });
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
      message: "User updated successfully",
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
        role: user.role,
        status: user.status,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user"
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete user by userId
    const result = await User.deleteOne({ userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user"
    });
  }
};



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 2️⃣ Check if password matches
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password"
      });
    }

    // 3️⃣ Generate JWT token
    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.type,
        isBlocked: user.isBlocked,
        profilePicture: user.profilePicture
      },
      process.env.SECRET,
      { expiresIn: "7d" } // token expires in 7 days
    );

    // 4️⃣ Send response
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login user"
    });
  }
};



export const isAdmin = (req) => {
  // Check if req.user exists
  if (!req.user) return false;

  // Check type
  return req.user.type === "admin";
};

export const isCustomer = (req) => {
  if (!req.user) return false;

  return req.user.type === "customer";
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Find user by email and hide password
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user"
    });
  }
};
