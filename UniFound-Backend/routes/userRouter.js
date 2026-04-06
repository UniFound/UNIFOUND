import express from "express";
import { createUser, deleteUser, getUser, getUserByEmail, loginUser } from "../controllers/userController.js";


const userRouter = express.Router();

// Create/Register a user
userRouter.post("/register", createUser);

// Get all users
userRouter.get("/", getUser);

// Get user by email
userRouter.get("/email/:email", getUserByEmail);

// Delete user by email
userRouter.delete("/:email", deleteUser); // changed param from :name to :email

// Login user
userRouter.post("/login", loginUser);

export default userRouter;