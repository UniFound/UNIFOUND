import Ticket from "../models/ticket.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Ticket
export const createTicket = async (req, res) => {
  try {
    const { userId, name, email, phone, subject, description } = req.body;
    if (!userId || !name || !email || !phone || !subject) {
      return res.status(400).json({ message: "userId, name, email, phone and subject are required" });
    }

    // Generate unique ticket ID with TID prefix
    const generateTicketId = () => {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      return `TID${timestamp}${random}`.toUpperCase();
    };

    const attachment = null; // Temporarily disabled file upload

    const ticket = await Ticket.create({
      ticketId: generateTicketId(),
      userId,
      name,
      email,
      phone,
      subject,
      description,
      attachment,
      messages: description ? [{ senderId: userId, senderType: "User", text: description }] : [],
    });

    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add message
export const addTicketMessage = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { senderId, text } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Determine sender type based on senderId
    const senderType = senderId === ticket.userId ? "User" : "Admin";
    
    ticket.messages.push({ senderId, senderType, text });

    await ticket.save();
    res.json({ message: "Message added", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tickets for a user
export const getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.params.userId });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single ticket by its ID
export const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    console.log('Backend: Fetching ticket with ID:', ticketId);
    console.log('Backend: Request params:', req.params);
    console.log('Backend: Full URL:', req.originalUrl);

    const ticket = await Ticket.findOne({ ticketId: ticketId });
    console.log('Backend: Found ticket:', ticket);
    console.log('Backend: All tickets in DB:', await Ticket.find({}));

    if (!ticket) {
      console.log('Backend: Ticket not found for ID:', ticketId);
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Backend error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all tickets for admin
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({}).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tickets for admin
export const getAdminTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedAdminId: req.params.adminId });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update ticket
export const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { subject, description, name, email, phone } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Update ticket fields
    if (subject !== undefined) ticket.subject = subject;
    if (description !== undefined) ticket.description = description;
    if (name !== undefined) ticket.name = name;
    if (email !== undefined) ticket.email = email;
    if (phone !== undefined) ticket.phone = phone;

    await ticket.save();
    res.json({ message: "Ticket updated successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update status
export const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, rejectionReason } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.status = status;
    
    // Add rejection reason if status is Rejected
    if (status === "Rejected" && rejectionReason) {
      ticket.rejectionReason = rejectionReason;
      // Add system message about rejection
      ticket.messages.push({
        senderId: null,
        senderType: "Admin",
        text: `Ticket rejected. Reason: ${rejectionReason}`,
        autoReply: true
      });
    } else {
      ticket.rejectionReason = null;
    }

    await ticket.save();
    res.json({ message: "Ticket status updated", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign admin
export const assignAdminToTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { adminId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.assignedAdminId = adminId;
    await ticket.save();
    res.json({ message: "Admin assigned to ticket", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit message in ticket
export const editTicketMessage = async (req, res) => {
  try {
    const { ticketId, messageId } = req.params;
    const { senderId, text, newText } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const message = ticket.messages.id(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    // Check ownership rules
    const isUserMessage = message.senderType === "User";
    const isAdminMessage = message.senderType === "Admin";
    const isTicketOwner = senderId === ticket.userId;
    const isAdmin = senderId !== ticket.userId; // Simplified admin check

    // Users can only edit their own messages
    if (isUserMessage && !isTicketOwner) {
      return res.status(403).json({ message: "Users can only edit their own messages" });
    }

    // Admins cannot edit user messages
    if (isAdminMessage && isTicketOwner) {
      return res.status(403).json({ message: "Admins cannot edit user messages" });
    }

    // Don't allow editing auto-reply messages
    if (message.autoReply) {
      return res.status(403).json({ message: "Auto-reply messages cannot be edited" });
    }

    // Use either 'text' or 'newText' field
    const updatedText = newText || text;
    message.text = updatedText;
    message.updatedAt = new Date();

    await ticket.save();
    res.json({ message: "Message updated successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete ticket
export const deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { senderId } = req.body; // Add senderId to request body

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Only users can delete their own tickets
    if (senderId !== ticket.userId) {
      return res.status(403).json({ message: "Only ticket owners can delete tickets" });
    }

    await Ticket.findByIdAndDelete(ticketId);
    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete message
export const deleteTicketMessage = async (req, res) => {
  try {
    const { ticketId, messageId } = req.params;
    const { senderId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const message = ticket.messages.id(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    // Check ownership rules
    const isUserMessage = message.senderType === "User";
    const isAdminMessage = message.senderType === "Admin";
    const isTicketOwner = senderId === ticket.userId;
    const isAdmin = senderId !== ticket.userId;

    // Users can only delete their own messages
    if (isUserMessage && !isTicketOwner) {
      return res.status(403).json({ message: "Users can only delete their own messages" });
    }

    // Admins can delete any message
    if (isAdminMessage && isAdmin) {
      // Allow deletion
    } else if (isAdminMessage && isTicketOwner) {
      return res.status(403).json({ message: "Users cannot delete admin messages" });
    }

    // Don't allow deleting auto-reply messages
    if (message.autoReply) {
      return res.status(403).json({ message: "Auto-reply messages cannot be deleted" });
    }

    ticket.messages.pull(messageId);
    await ticket.save();
    res.json({ message: "Message deleted successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};