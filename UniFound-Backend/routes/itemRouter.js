import express from "express";
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getPendingItems,
  approveItem,
  getAutoMatches,
  getItemsByUserId
} from "../controllers/itemController.js";

const router = express.Router();

router.get("/admin/pending", getPendingItems);
router.get("/auto-match/:itemId", getAutoMatches); 
router.get("/user-items/:userId", getItemsByUserId);

// 2. General Routes
router.post("/", createItem);
router.get("/", getAllItems);


router.get("/:id", getItemById); 
router.patch("/admin/approve/:id", approveItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;