import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    assignedAdminId: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: { // optional, main message for ticket creation
      type: String,
    },
    attachment: {
      type: String, // Store image URL or file path
      default: null,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed", "Rejected"],
      default: "Open",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    messages: [
      {
        senderId: { type: String, default: null },
        senderType: { type: String, enum: ["User", "Admin"], default: "User" },
        text: String,
        autoReply: { type: Boolean, default: false },
        seen: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;