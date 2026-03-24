import express from "express";
import {
  createTicket,
  addTicketMessage,
  getUserTickets,
  getTicketById,
  getAdminTickets,
  updateTicketStatus,
  assignAdminToTicket,
  deleteTicket
} from "../controllers/ticketController.js";

const router = express.Router();

// Create new ticket
router.post("/", createTicket);

// Add message to ticket
router.post("/:ticketId/message", addTicketMessage);

// Get ticket by ID → must come BEFORE /user/:userId or /admin/:adminId
router.get("/ticket/:ticketId", getTicketById); // ✅ notice the /ticket prefix to avoid conflicts

// Get tickets of a user
router.get("/user/:userId", getUserTickets);

// Get tickets assigned to an admin
router.get("/admin/:adminId", getAdminTickets);

// Update ticket status
router.put("/:ticketId/status", updateTicketStatus);

// Assign admin to ticket
router.put("/:ticketId/assign", assignAdminToTicket);

// Delete a ticket
router.delete("/:ticketId", deleteTicket);

export default router;