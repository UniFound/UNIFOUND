import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js"; 
import claimRouter from "./routes/claimRouter.js";
import itemRouter from "./routes/itemRouter.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// MongoDB Connection
const connectDB = async () => {
  try {
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/users", userRouter); 
app.use("/api/claims", claimRouter);
app.use("/api/items", itemRouter);

app.get("/", (req, res) => {
  res.send("UniFound Backend is Running & DB Connected! 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


/*
  Admin Users List:
 
  1. Minuri Sewmini 
     - Email (Username): minuri@gmail.com
     - Password: adminpassword123

  2. Rashmini Kavindya
     - Email (Username): rashmini@gmail.com
     - Password: adminpassword123

  3. Geethmi Uduwana
     - Email (Username): geethmi@gmail.com
     - Password: adminpassword123

  4. Chathuni Imalsha
     - Email (Username): chathuni@gmail.com
     - Password: adminpassword123

*/


/*
  Sample Customer Users:
  
  1. Chamidu Dilshan
     - Email: chamidu@gmail.com
     - Password: user123

  2. Kaveesha Sandeepani
     - Email: kavee@gmail.com
     - Password: user123
*/