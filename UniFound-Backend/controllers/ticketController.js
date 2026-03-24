import Ticket from "../models/ticket.js";

// Create Ticket
export const createTicket = async (req, res) => {
  try {
    const { userId, subject, description } = req.body;
    if (!userId || !subject) return res.status(400).json({ message: "userId and subject are required" });

    const ticket = await Ticket.create({
      userId,
      subject,
      description,
      messages: description ? [{ senderId: userId, text: description }] : [],
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

    ticket.messages.push({ senderId, text });

    if (!ticket.assignedAdminId) {
      ticket.messages.push({ senderId: null, text: "Admin is currently offline. We'll get back to you soon.", autoReply: true });
    }

    await ticket.save();
    res.json({ message: "Message added", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tickets for a user
export const getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.params.userId })
      .populate("userId", "firstName lastName email")
      .populate("assignedAdminId", "firstName lastName email");

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single ticket by its ID
export const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId)
      .populate("userId", "firstName lastName email")
      .populate("assignedAdminId", "firstName lastName email");

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tickets for admin
export const getAdminTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedAdminId: req.params.adminId })
      .populate("userId", "firstName lastName email")
      .populate("assignedAdminId", "firstName lastName email");
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update status
export const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.status = status;
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

// Delete ticket
export const deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    await Ticket.findByIdAndDelete(ticketId);
    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};