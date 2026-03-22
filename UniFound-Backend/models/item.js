import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    status: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


const Item = mongoose.model("item", itemSchema);

export default Item;