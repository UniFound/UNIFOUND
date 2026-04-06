import express from "express";
import {
  createAdminUser,
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
} from "../controllers/adminUserController.js";

const router = express.Router();

// Create
router.post("/", createAdminUser);

// Read
router.get("/", getAdminUsers);

// Update
router.put("/:id", updateAdminUser);

// Delete
router.delete("/:id", deleteAdminUser);

export default router;