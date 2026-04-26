import express from "express";
import { 
  getUser, 
  createUser, 
  updateUser,
  deleteUser, 
  loginUser, 
  getUserByEmail 
} from "../controllers/userController.js";

const router = express.Router();

// Public routes
router.post("/login", loginUser);
router.post("/register", createUser);

// Protected routes (add middleware as needed)
router.get("/", getUser);
router.get("/:email", getUserByEmail);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;
