// routes/messageRoutes.js
import express from "express";
import {
  sendMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} from "../controllers/messageController.js";

const router = express.Router();

// send message
router.post("/", sendMessage);

// get messages by conversation
router.get("/:conversationId", getMessages);

// edit message
router.put("/:id", updateMessage);

// delete message
router.delete("/:id", deleteMessage);

export default router;