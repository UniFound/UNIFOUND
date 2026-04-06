import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    claimId: {
      type: String,
      unique: true
    },
    
    // 🔗 Found Item එක (මේක MongoDB එකේම create වෙන _id එකක් නිසා ObjectId විදියටම තියෙන්න දෙන්න)
    itemId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "item", 
      required: true,
    },

    // 👤 [FIXED] Claim එක දාන User (User ගේ custom string ID එක)
    userId: {
      type: String, // 👈 ObjectId වෙනුවට String කළා
      required: true,
    },

    // 🔍 අර 90%ක් match වුණු Lost Item Report එකේ ID එක (මේකත් item එකක් නිසා ObjectId හරි)
    lostItemId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "item",
      default: null 
    },

    description: {
      type: String,
      required: true,
    },

    evidenceText: {
      type: String,
      required: true,
    },

    evidenceImage: {
      type: String, 
      default: null,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    meetingLocation: {
      type: String,
      required: true,
    },

    meetingTime: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Pending", "Under Review", "Approved", "Rejected", "On Hold"],
      default: "Pending",
    },

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
        // 🚨 [FIXED] Update කරපු admin ගේ ID එකත් String එකක් කළා
        updatedBy: { 
          type: String // 👈 ObjectId වෙනුවට String කළා
        }, 
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Claim", claimSchema);