import express from "express";
import mongoose from "mongoose";
import Application from "../models/Application.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Is line ka matlab: neeche ke SAARE routes pehle authMiddleware se guzrenge.
// Matlab bina login token ke koi bhi in routes ko hit nahi kar sakta.
router.use(authMiddleware);

// GET /api/applications — sirf LOGGED-IN user ki applications laayega
router.get("/", async (req, res) => {
  const apps = await Application.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(apps);
});

// POST /api/applications — nayi application add karo
router.post("/", async (req, res) => {
  try {
    const { company, role, status, appliedDate, notes, link } = req.body;
    const app = await Application.create({
      user: req.userId, // req.userId authMiddleware ne set kiya tha
      company,
      role,
      status,
      appliedDate,
      notes,
      link,
    });
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/applications/:id — status ya details update karo
router.put("/:id", async (req, res) => {
  try {
    // findOneAndUpdate mein { user: req.userId } add karna zaroori hai —
    // isse koi doosre user ki application edit nahi kar sakta, sirf apni.
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true } // updated document return karega
    );
    if (!app) return res.status(404).json({ message: "Application not found" });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/applications/:id
router.delete("/:id", async (req, res) => {
  const app = await Application.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!app) return res.status(404).json({ message: "Application not found" });
  res.json({ message: "Deleted successfully" });
});

// GET /api/applications/stats/summary — dashboard ke charts ke liye data
router.get("/stats/summary", async (req, res) => {
  // MongoDB aggregation — status ke hisaab se group karke count nikalta hai
  const statusCounts = await Application.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(req.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const total = await Application.countDocuments({ user: req.userId });

  res.json({ total, statusCounts });
});

export default router;
