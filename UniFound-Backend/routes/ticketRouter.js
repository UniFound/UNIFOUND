import express from "express";
import {
  createTicket,
  addTicketMessage,
  editTicketMessage,
  deleteTicketMessage,
  getUserTickets,
  getTicketById,
  getAllTickets,
  getAdminTickets,
  updateTicket,
  updateTicketStatus,
  assignAdminToTicket,
  deleteTicket
} from "../controllers/ticketController.js";

const router = express.Router();

// Create new ticket
router.post("/", createTicket);

// Get all tickets for admin
router.get("/", getAllTickets);

// Add message to ticket
router.post("/:ticketId/message", addTicketMessage);

// Edit message in ticket
router.put("/:ticketId/message/:messageId", editTicketMessage);

// Delete message in ticket
router.delete("/:ticketId/message/:messageId", deleteTicketMessage);

// Get ticket by ticketId (for frontend navigation)
router.get("/:ticketId", getTicketById);

// Get tickets of a user
router.get("/user/:userId", getUserTickets);

// Get tickets assigned to an admin
router.get("/admin/:adminId", getAdminTickets);

// Update ticket
router.put("/:ticketId", updateTicket);

// Update ticket status
router.put("/:ticketId/status", updateTicketStatus);

// Assign admin to ticket
router.put("/:ticketId/assign", assignAdminToTicket);

// Delete a ticket
router.delete("/:ticketId", deleteTicket);

export default router;