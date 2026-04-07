import Message from "../models/message.js";
import Chat from "../models/chat.js";
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Helper function to validate custom string ID
const isValidCustomId = (id) => {
  return id && typeof id === 'string' && id.trim().length > 0;
};

// Helper function for debug logging
const debugLog = (operation, data) => {
  console.log(` [MSG-${operation}] Debug Info:`, {
    timestamp: new Date().toISOString(),
    ...data
  });
};

// Send Message - Production Ready
export const sendMessage = async (req, res) => {
  const operation = "SEND";
  
  try {
    const { chatId, senderId, text } = req.body;

    // Input validation
    if (!chatId?.trim() || !senderId?.trim() || !text?.trim()) {
      debugLog(operation, { 
        error: "Missing required fields", 
        chatId, 
        senderId, 
        text: text?.substring(0, 50) + (text?.length > 50 ? "..." : "")
      });
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields: chatId, senderId, text" 
      });
    }

    const normalizedChatId = chatId.trim();
    const normalizedSenderId = senderId.trim();
    const normalizedText = text.trim();

    debugLog(operation, { 
      chatId: normalizedChatId,
      senderId: normalizedSenderId,
      textLength: normalizedText.length,
      step: "Input validation passed"
    });

    // Validate chatId format
    if (!isValidObjectId(normalizedChatId)) {
      debugLog(operation, { 
        error: "Invalid chatId format", 
        chatId: normalizedChatId 
      });
      return res.status(400).json({ 
        success: false,
        message: "Invalid chatId format" 
      });
    }

    // Validate senderId format
    if (!isValidCustomId(normalizedSenderId)) {
      debugLog(operation, { 
        error: "Invalid senderId format", 
        senderId: normalizedSenderId 
      });
      return res.status(400).json({ 
        success: false,
        message: "Invalid senderId format" 
      });
    }

    // Find chat and validate
    let chat;
    try {
      chat = await Chat.findById(normalizedChatId);
    } catch (dbError) {
      debugLog(operation, { 
        error: "Database query failed", 
        chatId: normalizedChatId, 
        dbError: dbError.message 
      });
      return res.status(500).json({ 
        success: false,
        message: "Database error while finding chat" 
      });
    }

    if (!chat) {
      debugLog(operation, { 
        error: "Chat not found", 
        chatId: normalizedChatId 
      });
      return res.status(404).json({ 
        success: false,
        message: "Chat not found" 
      });
    }

    debugLog(operation, { 
      chatId: normalizedChatId,
      chatParticipants: chat.participants,
      step: "Chat found"
    });

    // Normalize participants for comparison
    const normalizedParticipants = chat.participants.map(p => String(p).trim());

    // Robust authorization check
    const isAuthorized = normalizedParticipants.some(participant => 
      participant === normalizedSenderId
    );

    debugLog(operation, { 
      chatId: normalizedChatId,
      senderId: normalizedSenderId,
      participants: normalizedParticipants,
      isAuthorized,
      step: "Authorization check"
    });

    if (!isAuthorized) {
      debugLog(operation, { 
        error: "Not authorized to send message",
        chatId: normalizedChatId,
        senderId: normalizedSenderId,
        participants: normalizedParticipants
      });
      return res.status(403).json({ 
        success: false,
        message: "Not authorized to send message",
        debug: {
          chatId: normalizedChatId,
          senderId: normalizedSenderId,
          participants: normalizedParticipants
        }
      });
    }

    // Create message with validated data
    let message;
    try {
      message = await Message.create({
        chatId: normalizedChatId,
        senderId: normalizedSenderId,
        text: normalizedText,
        status: "sent"
      });
    } catch (dbError) {
      debugLog(operation, { 
        error: "Failed to create message", 
        chatId: normalizedChatId,
        senderId: normalizedSenderId,
        dbError: dbError.message 
      });
      return res.status(500).json({ 
        success: false,
        message: "Database error while creating message" 
      });
    }

    // Update chat's last message and activity
    try {
      await Chat.findByIdAndUpdate(normalizedChatId, { 
        lastMessage: normalizedText,
        lastActivity: new Date()
      });
    } catch (dbError) {
      debugLog(operation, { 
        error: "Failed to update chat", 
        chatId: normalizedChatId,
        dbError: dbError.message 
      });
      // Don't fail the request if chat update fails, just log it
    }

    debugLog(operation, { 
      chatId: normalizedChatId,
      messageId: message._id,
      senderId: normalizedSenderId,
      step: "Message sent successfully"
    });

    res.status(201).json({ 
      success: true,
      data: message,
      message: "Message sent successfully" 
    });

  } catch (error) {
    debugLog(operation, { 
      error: "Unexpected server error", 
      errorMessage: error.message,
      stack: error.stack 
    });
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get Messages - Production Ready
export const getMessages = async (req, res) => {
  const operation = "GET_MESSAGES";
  
  try {
    const { chatId } = req.params;

    if (!chatId?.trim()) {
      debugLog(operation, { error: "Missing chatId in params" });
      return res.status(400).json({ 
        success: false,
        message: "chatId is required" 
      });
    }

    const normalizedChatId = chatId.trim();

    if (!isValidObjectId(normalizedChatId)) {
      debugLog(operation, { 
        error: "Invalid chatId format", 
        chatId: normalizedChatId 
      });
      return res.status(400).json({ 
        success: false,
        message: "Invalid chatId format" 
      });
    }

    debugLog(operation, { chatId: normalizedChatId, step: "Input validation passed" });

    // Verify chat exists
    let chat;
    try {
      chat = await Chat.findById(normalizedChatId);
    } catch (dbError) {
      debugLog(operation, { 
        error: "Database query failed", 
        chatId: normalizedChatId, 
        dbError: dbError.message 
      });
      return res.status(500).json({ 
        success: false,
        message: "Database error while finding chat" 
      });
    }

    if (!chat) {
      debugLog(operation, { 
        error: "Chat not found", 
        chatId: normalizedChatId 
      });
      return res.status(404).json({ 
        success: false,
        message: "Chat not found" 
      });
    }

    // Get messages
    let messages;
    try {
      messages = await Message.find({
        chatId: normalizedChatId,
        isDeleted: false
      }).sort({ createdAt: 1 });
    } catch (dbError) {
      debugLog(operation, { 
        error: "Database query failed", 
        chatId: normalizedChatId, 
        dbError: dbError.message 
      });
      return res.status(500).json({ 
        success: false,
        message: "Database error while fetching messages" 
      });
    }

    debugLog(operation, { 
      chatId: normalizedChatId,
      messageCount: messages.length,
      step: "Messages retrieved successfully"
    });

    res.status(200).json({ 
      success: true,
      data: messages,
      message: "Messages retrieved successfully" 
    });

  } catch (error) {
    debugLog(operation, { 
      error: "Unexpected server error", 
      errorMessage: error.message,
      stack: error.stack 
    });
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update Message (Edit) - Production Ready
export const editMessage = async (req, res) => {
  const operation = "EDIT";
  
  try {
    const { id } = req.params;
    const { senderId, text } = req.body;

    // Input validation
    if (!id?.trim() || !senderId?.trim() || !text?.trim()) {
      debugLog(operation, { 
        error: "Missing required fields", 
        messageId: id, 
        senderId, 
        text: text?.substring(0, 50) + (text?.length > 50 ? "..." : "")
      });
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields: messageId, senderId, text" 
      });
    }

    const normalizedMessageId = id.trim();
    const normalizedSenderId = senderId.trim();
    const normalizedText = text.trim();

    if (!isValidObjectId(normalizedMessageId)) {
      debugLog(operation, { 
        error: "Invalid messageId format", 
        messageId: normalizedMessageId 
      });
      return res.status(400).json({ 
        success: false,
        message: "Invalid messageId format" 
      });
    }

    debugLog(operation, { 
      messageId: normalizedMessageId,
      senderId: normalizedSenderId,
      textLength: normalizedText.length,
      step: "Input validation passed"
    });

    // Find message
    let message;
    try {
      message = await Message.findById(normalizedMessageId);
    } catch (dbError) {
      debugLog(operation, { 
        error: "Database query failed", 
        messageId: normalizedMessageId, 
        dbError: dbError.message 
      });
      return res.status(500).json({ 
        success: false,
        message: "Database error while finding message" 
      });
    }

    if (!message) {
      debugLog(operation, { 
        error: "Message not found", 
        messageId: normalizedMessageId 
      });
      return res.status(404).json({ 
        success: false,
        message: "Message not found" 
      });
    }

    // Check authorization
    if (message.senderId !== normalizedSenderId) {
      debugLog(operation, { 
        error: "Not authorized to edit message",
        messageId: normalizedMessageId,
        messageSenderId: message.senderId,
        requestSenderId: normalizedSenderId
      });
      return res.status(403).json({ 
        success: false,
        message: "You can edit only your messages" 
      });
    }

    // Update message
    try {
      message.text = normalizedText;
      await message.save();
    } catch (dbError) {
      debugLog(operation, { 
        error: "Failed to update message", 
        messageId: normalizedMessageId,
        dbError: dbError.message 
      });
      return res.status(500).json({ 
        success: false,
        message: "Database error while updating message" 
      });
    }

    debugLog(operation, { 
      messageId: normalizedMessageId,
      step: "Message updated successfully"
    });

    res.status(200).json({ 
      success: true,
      data: message,
      message: "Message updated successfully" 
    });

  } catch (error) {
    debugLog(operation, { 
      error: "Unexpected server error", 
      errorMessage: error.message,
      stack: error.stack 
    });
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete Message (Soft Delete) - Production Ready
export const deleteMessage = async (req, res) => {
  const operation = "DELETE";
  
  try {
    const { id } = req.params;
    const { senderId } = req.body;

    // Input validation
    if (!id?.trim() || !senderId?.trim()) {
      debugLog(operation, { 
        error: "Missing required fields", 
        messageId: id, 
        senderId 
      });
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields: messageId, senderId" 
      });
    }

    const normalizedMessageId = id.trim();
    const normalizedSenderId = senderId.trim();

    if (!isValidObjectId(normalizedMessageId)) {
      debugLog(operation, { 
        error: "Invalid messageId format", 
        messageId: normalizedMessageId 
      });
      return res.status(400).json({ 
        success: false,
        message: "Invalid messageId format" 
      });
    }

    debugLog(operation, { 
      messageId: normalizedMessageId,
      senderId: normalizedSenderId,
      step: "Input validation passed"
    });

    // Find message
    let message;
    try {
      message = await Message.findById(normalizedMessageId);
    } catch (dbError) {
      debugLog(operation, { 
        error: "Database query failed", 
        messageId: normalizedMessageId, 
        dbError: dbError.message 
      });
      return res.status(500).json({ 
        success: false,
        message: "Database error while finding message" 
      });
    }

    if (!message) {
      debugLog(operation, { 
        error: "Message not found", 
        messageId: normalizedMessageId 
      });
      return res.status(404).json({ 
        success: false,
        message: "Message not found" 
      });
    }

    // Check authorization
    if (message.senderId !== normalizedSenderId) {
      debugLog(operation, { 
        error: "Not authorized to delete message",
        messageId: normalizedMessageId,
        messageSenderId: message.senderId,
        requestSenderId: normalizedSenderId
      });
      return res.status(403).json({ 
        success: false,
        message: "You can delete only your messages" 
      });
    }

    // Soft delete message
    try {
      message.isDeleted = true;
      await message.save();
    } catch (dbError) {
      debugLog(operation, { 
        error: "Failed to delete message", 
        messageId: normalizedMessageId,
        dbError: dbError.message 
      });
      return res.status(500).json({ 
        success: false,
        message: "Database error while deleting message" 
      });
    }

    debugLog(operation, { 
      messageId: normalizedMessageId,
      step: "Message deleted successfully"
    });

    res.status(200).json({ 
      success: true,
      message: "Message deleted successfully" 
    });

  } catch (error) {
    debugLog(operation, { 
      error: "Unexpected server error", 
      errorMessage: error.message,
      stack: error.stack 
    });
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update Message Status (Seen/Delivered) - Production Ready
export const updateMessageStatus = async (req, res) => {
  const operation = "UPDATE_STATUS";
  
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Input validation
    if (!id?.trim() || !status?.trim()) {
      debugLog(operation, { 
        error: "Missing required fields", 
        messageId: id, 
        status 
      });
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields: messageId, status" 
      });
    }

    const normalizedMessageId = id.trim();
    const normalizedStatus = status.trim();

    if (!isValidObjectId(normalizedMessageId)) {
      debugLog(operation, { 
        error: "Invalid messageId format", 
        messageId: normalizedMessageId 
      });
      return res.status(400).json({ 
        success: false,
        message: "Invalid messageId format" 
      });
    }

    const validStatuses = ["sent", "delivered", "seen"];
    if (!validStatuses.includes(normalizedStatus)) {
      debugLog(operation, { 
        error: "Invalid status", 
        messageId: normalizedMessageId,
        status: normalizedStatus,
        validStatuses
      });
      return res.status(400).json({ 
        success: false,
        message: "Invalid status. Must be: sent, delivered, or seen" 
      });
    }

    debugLog(operation, { 
      messageId: normalizedMessageId,
      status: normalizedStatus,
      step: "Input validation passed"
    });

    // Update message status
    let updatedMessage;
    try {
      updatedMessage = await Message.findByIdAndUpdate(
        normalizedMessageId,
        { status: normalizedStatus },
        { new: true, runValidators: true }
      );
    } catch (dbError) {
      debugLog(operation, { 
        error: "Database update failed", 
        messageId: normalizedMessageId,
        status: normalizedStatus,
        dbError: dbError.message 
      });
      return res.status(500).json({ 
        success: false,
        message: "Database error while updating message status" 
      });
    }

    if (!updatedMessage) {
      debugLog(operation, { 
        error: "Message not found for status update", 
        messageId: normalizedMessageId 
      });
      return res.status(404).json({ 
        success: false,
        message: "Message not found" 
      });
    }

    debugLog(operation, { 
      messageId: normalizedMessageId,
      oldStatus: updatedMessage.status,
      newStatus: normalizedStatus,
      step: "Message status updated successfully"
    });

    res.status(200).json({ 
      success: true,
      data: updatedMessage,
      message: "Message status updated successfully" 
    });

  } catch (error) {
    debugLog(operation, { 
      error: "Unexpected server error", 
      errorMessage: error.message,
      stack: error.stack 
    });
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};