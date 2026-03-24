import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
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

  type: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer"
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

const User = mongoose.model("User", userSchema);

export default User;