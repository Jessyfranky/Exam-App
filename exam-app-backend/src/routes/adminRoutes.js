import express from "express";
import ExamConfig from "../models/ExamConfig.js";

const router = express.Router();

// POST /api/admin/config - Create a new exam configuration
router.post("/config", async (req, res) => {
  try {
    const { adminId, subjects, timer } = req.body;
    // Generate a unique examId using a random number and timestamp
    const examId = "EXAM-" + Math.floor(Math.random() * 1000000) + "-" + Date.now();
    const examConfig = new ExamConfig({ adminId, examId, subjects, timer });
    await examConfig.save();
    res.status(201).json(examConfig);
  } catch (error) {
    console.error("Error creating exam config:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/config/subject", async (req, res) => {
  try {
    const { adminId, subject, questions, timer } = req.body;
    // For simplicity, create a new ExamConfig document per subject or update an existing configuration.
    // Here we'll create a new document:
    const examConfig = new ExamConfig({
      adminId,
      examId: subject + "-" + Date.now(), // or generate a unique ID in another way
      subjects: [{ name: subject, questions }],
      timer
    });
    await examConfig.save();
    res.status(201).json(examConfig);
  } catch (error) {
    console.error("Error saving subject config:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/config/:examId - Get exam configuration by examId
router.get("/config/:examId", async (req, res) => {
  try {
    const config = await ExamConfig.findOne({ examId: req.params.examId });
    if (!config) {
      return res.status(404).json({ message: "Exam configuration not found" });
    }
    res.json(config);
  } catch (error) {
    console.error("Error fetching exam config:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
