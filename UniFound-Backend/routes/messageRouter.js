import express from "express";
import {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  updateMessageStatus
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/:chatId", getMessages);
router.put("/:id", editMessage);
router.delete("/:id", deleteMessage);
router.patch("/:id/status", updateMessageStatus);

export default router;