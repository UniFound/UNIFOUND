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

router.post("/", createItem);
router.get("/", getAllItems);
router.get("/:id", getItemById);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);
router.get("/admin/pending", getPendingItems); 
router.patch("/admin/approve/:id", approveItem);
router.get('/auto-match/:itemId', getAutoMatches);
router.get("/user-items/:userId", getItemsByUserId);

export default router;