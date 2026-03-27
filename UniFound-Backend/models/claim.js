import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    claimId: {
    type: String,
    unique: true
  },
    // 🔗 Which item is being claimed
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "item",
      required: true,
    },

    // 👤 Who is claiming
    userId: {
      type: String ,
      ref: "User",
      required: true,
    },

    // 📝 Main explanation why this item belongs to user
    description: {
      type: String,
      required: true,
    },

    // 🧾 Evidence text (like "my ID inside wallet")
    evidenceText: {
      type: String,
      required: true,
    },

    // 🖼 Evidence image (bill, photo, etc.)
    evidenceImage: {
      type: String, // URL (Cloudinary / upload path)
      default: null,
    },

    // 📞 Contact number
    contactNumber: {
      type: String,
      required: true,
    },

    // 📧 Optional email
    email: {
      type: String,
    },

    // 📍 Preferred meeting place
    meetingLocation: {
      type: String,
      required: true,
    },

    // 🕒 Preferred meeting time
    meetingTime: {
      type: String,
    },

    // 📌 Claim status
    status: {
      type: String,
      enum: ["Pending", "Under Review", "Approved", "Rejected", "On Hold"],
      default: "Pending",
    },

    // 👮 Admin notes (optional)
    adminNote: {
      type: String,
      default: "",
    },

    // 🔄 Workflow history (tracking status changes)
    history: [
      {
        status: {
          type: String,
          enum: ["Pending", "Under Review", "Approved", "Rejected", "On Hold"],
        },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],

    // ❌ Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Claim", claimSchema);