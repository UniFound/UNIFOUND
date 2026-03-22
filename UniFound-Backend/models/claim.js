import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    // 🔗 Which item is being claimed
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },

    // 👤 Who is claiming
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📝 Why this item is yours (main explanation)
    description: {
      type: String,
      required: true,
    },

    // 🧾 Evidence text (details like "my ID inside wallet")
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
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // 👮 Admin notes (optional)
    adminNote: {
      type: String,
      default: "",
    },

    // ❌ Soft delete (optional)
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Claim", claimSchema);