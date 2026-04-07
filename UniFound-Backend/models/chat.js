import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    claimId: {
      type: String, // Changed from ObjectId to String to support custom claimIds
      required: true,
    },

    participants: [
      {
        type: String, // userId (custom string)
        required: true,
      }
    ],

    lastMessage: {
      type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);