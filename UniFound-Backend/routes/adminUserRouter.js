import express from "express";
import { 
  getAdminUsers, 
  createAdminUser, 
  updateAdminUser,
  deleteAdminUser
} from "../controllers/adminUserController.js";

const router = express.Router();

// Admin user routes
router.get("/", getAdminUsers);
router.post("/", createAdminUser);
router.put("/:userId", updateAdminUser);
router.delete("/:userId", deleteAdminUser);

export default router;
