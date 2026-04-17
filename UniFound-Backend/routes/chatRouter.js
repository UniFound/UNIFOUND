import express from "express";
import { createChat, getChat, getUserChats } from "../controllers/chatController.js";

const router = express.Router();

// Create or get chat by claimId
router.post("/", createChat);

// Get chat by claimId
router.get("/:claimId", getChat);

// Get all chats for a user
router.get("/user/:userId", getUserChats);

export default router;