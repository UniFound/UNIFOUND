import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    trim: true
  },
  action: {
    type: String,
    required: true,
    trim: true
  },
  resource: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ["success", "error"],
    default: "success"
  },
  details: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
