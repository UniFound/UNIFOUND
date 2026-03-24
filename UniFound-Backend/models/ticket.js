import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        autoReply: { type: Boolean, default: false },
        seen: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);