import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import userRouter from "./routes/userRouter.js";
import claimRouter from "./routes/claimRouter.js";
import itemRouter from "./routes/itemRouter.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import ticketRouter from "./routes/ticketRouter.js";
import adminUserRoutes from "./routes/adminUserRoutes.js"; // 

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/users", userRouter);
app.use("/api/admin-users", adminUserRoutes); // ✅ NEW (Admin User Management)
app.use("/api/claims", claimRouter);
app.use("/api/items", itemRouter);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/tickets", ticketRouter);

// Root route
app.get("/", (req, res) => {
  res.send("UniFound Backend is Running & DB Connected! 🚀");
});

// Server Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});