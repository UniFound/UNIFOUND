import express from "express";
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getAutoMatches,
  getItemsByUserId
} from "../controllers/itemController.js";

const router = express.Router();

router.post("/", createItem);
router.get("/", getAllItems);
router.get("/:id", getItemById);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);
router.get('/auto-match/:itemId', getAutoMatches);
router.get("/user-items/:userId", getItemsByUserId);

export default router;