import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
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
    status: {
      type: String,
      enum: ["Open", "Pending", "Resolved", "Closed"],
      default: "Open",
    },
    messages: [
      {
        senderId: { type: String, default: null },
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

export default mongoose.model("Ticket", ticketSchema);