import Ticket from "../models/ticket.js";

// Create Ticket
export const createTicket = async (req, res) => {
  try {
    const { userId, name, email, phone, subject, description } = req.body;
    if (!userId || !name || !email || !phone || !subject) {
      return res.status(400).json({ message: "userId, name, email, phone and subject are required" });
    }

    const ticket = await Ticket.create({
      userId,
      name,
      email,
      phone,
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

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    res.json(ticket);
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

// Edit message in ticket
export const editTicketMessage = async (req, res) => {
  try {
    const { ticketId, messageId } = req.params;
    const { senderId, text, newText } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const message = ticket.messages.id(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    // Check if the user is the original sender of the message
    if (message.senderId !== senderId) {
      return res.status(403).json({ message: "You can only edit your own messages" });
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
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    await Ticket.findByIdAndDelete(ticketId);
    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};