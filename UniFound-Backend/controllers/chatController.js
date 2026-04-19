import Chat from "../models/chat.js";
import Claim from "../models/claim.js";
import Item from "../models/item.js";
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
  console.log(` [CHAT-${operation}] Debug Info:`, {
    timestamp: new Date().toISOString(),
    ...data
  });
};

// Create Chat - Production Ready
export const createChat = async (req, res) => {
  const operation = "CREATE";
  
  try {
    const { claimId } = req.body;

    // Input validation
    if (!claimId?.trim()) {
      debugLog(operation, { error: "Missing claimId", claimId });
      return res.status(400).json({ 
        success: false,
        message: "claimId is required" 
      });
    }

    const normalizedClaimId = claimId.trim();
    debugLog(operation, { claimId: normalizedClaimId, step: "Input validation passed" });

    // Validate claimId format (now accepts custom strings)
    // Note: claimId is now stored as String in Chat model, so no ObjectId validation needed

    let claim;
    try {
      claim = await Claim.findOne({ claimId: normalizedClaimId }).populate("itemId");
    } catch (dbError) {
      debugLog(operation, { error: "Database query failed", claimId: normalizedClaimId, dbError: dbError.message });
      return res.status(500).json({ 
        success: false,
        message: "Database error while finding claim" 
      });
    }

    if (!claim) {
      debugLog(operation, { error: "Claim not found", claimId: normalizedClaimId });
      return res.status(404).json({ 
        success: false,
        message: "Claim not found" 
      });
    }

    debugLog(operation, { 
      claimId: normalizedClaimId, 
      claimStatus: claim.status,
      step: "Claim found and populated"
    });

    // Check claim approval status
    if (claim.status !== "Approved" && claim.status !== "Verified") {
      debugLog(operation, { 
        error: "Claim not approved", 
        claimId: normalizedClaimId, 
        status: claim.status 
      });
      return res.status(403).json({ 
        success: false,
        message: "Chat allowed only after claim approval" 
      });
    }

    // Extract and validate user IDs
    const claimerId = String(claim.userId || '').trim();
    const finderId = String(claim.itemId?.user_id || '').trim();

    debugLog(operation, { 
      claimId: normalizedClaimId,
      claimerId,
      finderId,
      claimerIdValid: isValidCustomId(claimerId),
      finderIdValid: isValidCustomId(finderId),
      step: "User IDs extracted"
    });

    // Validate extracted IDs
    if (!isValidCustomId(claimerId) || !isValidCustomId(finderId)) {
      debugLog(operation, { 
        error: "Invalid user IDs in claim", 
        claimId: normalizedClaimId, 
        claimerId, 
        finderId 
      });
      return res.status(400).json({ 
        success: false,
        message: "Invalid user IDs in claim",
        debug: { claimerId, finderId }
      });
    }

    // Check for existing chat
    let existingChat;
    try {
      existingChat = await Chat.findOne({ claimId: normalizedClaimId });
    } catch (dbError) {
      debugLog(operation, { error: "Failed to check existing chat", claimId: normalizedClaimId, dbError: dbError.message });
      return res.status(500).json({ 
        success: false,
        message: "Database error while checking existing chat" 
      });
    }

    if (existingChat) {
      debugLog(operation, { 
        claimId: normalizedClaimId, 
        existingChatId: existingChat._id,
        step: "Existing chat found" 
      });
      return res.status(200).json({ 
        success: true,
        data: existingChat,
        message: "Chat already exists" 
      });
    }

    // Create new chat with normalized participants
    const participants = [claimerId, finderId].filter(Boolean);
    
    let newChat;
    try {
      newChat = await Chat.create({
        claimId: normalizedClaimId,
        participants,
        lastMessage: "",
      });
    } catch (dbError) {
      debugLog(operation, { 
        error: "Failed to create new chat", 
        claimId: normalizedClaimId, 
        participants,
        dbError: dbError.message 
      });
      return res.status(500).json({ 
        success: false,
        message: "Database error while creating chat" 
      });
    }

    debugLog(operation, { 
      claimId: normalizedClaimId,
      newChatId: newChat._id,
      participants,
      step: "New chat created successfully"
    });

    res.status(201).json({ 
      success: true,
      data: newChat,
      message: "Chat created successfully" 
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

// Get Chat by Claim ID - Production Ready
export const getChat = async (req, res) => {
  const operation = "GET";
  
  try {
    const { claimId } = req.params;

    if (!claimId?.trim()) {
      debugLog(operation, { error: "Missing claimId in params" });
      return res.status(400).json({ 
        success: false,
        message: "claimId is required" 
      });
    }

    const normalizedClaimId = claimId.trim();
    debugLog(operation, { claimId: normalizedClaimId, step: "Input validation passed" });

    let chat;
    try {
      chat = await Chat.findOne({ claimId: normalizedClaimId }).populate("claimId");
    } catch (dbError) {
      debugLog(operation, { error: "Database query failed", claimId: normalizedClaimId, dbError: dbError.message });
      return res.status(500).json({ 
        success: false,
        message: "Database error while finding chat" 
      });
    }
    
    if (!chat) {
      debugLog(operation, { error: "Chat not found", claimId: normalizedClaimId });
      return res.status(404).json({ 
        success: false,
        message: "Chat not found" 
      });
    }

    debugLog(operation, { 
      claimId: normalizedClaimId,
      chatId: chat._id,
      step: "Chat retrieved successfully"
    });

    res.status(200).json({ 
      success: true,
      data: chat,
      message: "Chat retrieved successfully" 
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

// Get All Chats for a User - Production Ready
export const getUserChats = async (req, res) => {
  const operation = "GET_USER_CHATS";
  
  try {
    const { userId } = req.params;

    if (!isValidCustomId(userId)) {
      debugLog(operation, { error: "Invalid userId", userId });
      return res.status(400).json({ 
        success: false,
        message: "Valid userId is required" 
      });
    }

    const normalizedUserId = userId.trim();
    debugLog(operation, { userId: normalizedUserId, step: "Input validation passed" });

    let chats;
    try {
      chats = await Chat.find({ 
        participants: { $in: [normalizedUserId] } 
      }).populate("claimId").sort({ updatedAt: -1 });
    } catch (dbError) {
      debugLog(operation, { error: "Database query failed", userId: normalizedUserId, dbError: dbError.message });
      return res.status(500).json({ 
        success: false,
        message: "Database error while finding user chats" 
      });
    }

    debugLog(operation, { 
      userId: normalizedUserId,
      chatCount: chats.length,
      step: "User chats retrieved successfully"
    });

    res.status(200).json({ 
      success: true,
      data: chats,
      message: "User chats retrieved successfully" 
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