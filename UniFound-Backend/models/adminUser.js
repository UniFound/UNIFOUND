import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer"
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  isBlocked: {
    type: Boolean,
    default: false
  },

  profilePicture: {
    type: String,
    default: ""
  }

}, { timestamps: true });

const AdminUser = mongoose.model("AdminUser", adminUserSchema);

export default AdminUser;
