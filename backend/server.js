import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import applicationRoutes from "./routes/applications.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json()); // incoming JSON body ko parse karta hai (req.body milega isi se)

// Routes mount karna — "/api/auth" pe jitni bhi requests aayengi wo auth.js file handle karegi
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// Simple health check — deploy hone ke baad check karne ke liye ki server zinda hai
app.get("/", (req, res) => res.json({ status: "Job Tracker API is running" }));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
