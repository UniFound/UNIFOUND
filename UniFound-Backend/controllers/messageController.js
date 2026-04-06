// controllers/messageController.js
import Message from "../models/message.js";
import Notification from "../models/notification.js";

// ✅ Send Message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, receiverId, text } = req.body;

    const msg = await Message.create({
      conversationId,
      senderId,
      text,
    });

    // 🔔 Create notification
    await Notification.create({
      userId: receiverId,
      message: "New message received",
      type: "chat",
    });

    res.status(201).json(msg);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📩 Get Messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update Message
export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, userId } = req.body;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // 🔐 Only sender can edit
    if (message.senderId.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    message.text = text;
    await message.save();

    res.json({
      message: "Message updated",
      data: message,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Soft Delete Message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // 🔐 Only sender can delete
    if (message.senderId.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    message.isDeleted = true;
    message.text = "This message was deleted";

    await message.save();

    res.json({ message: "Message deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};