// models/conversation.js
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    claimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
    }
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);