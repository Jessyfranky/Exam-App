import express from "express";
import Question from "../models/Question.js";
import User from "../models/User.js";

const router = express.Router();

// POST /api/exam/submit
router.post("/submit", async (req, res) => {
  try {
    // Expecting request body: { userId, answers }
    // answers is an object mapping questionId -> user's answer
    const { userId, answers } = req.body;
    if (!userId || !answers) {
      return res.status(400).json({ message: "User ID and answers are required." });
    }

    let score = 0;
    const questionIds = Object.keys(answers);
    // Loop through each submitted answer and compare with correct answer
    for (const questionId of questionIds) {
      const question = await Question.findById(questionId);
      if (question && question.correctAnswer === answers[questionId]) {
        score++;
      }
    }

    // Update user's scores (assuming user.scores is an array)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Here we simply push a new exam score.
    // You can add additional fields such as subject, date, etc.
    user.scores.push({ subject: "Exam", score });
    await user.save();

    res.json({ score, totalQuestions: questionIds.length, message: "Exam submitted successfully" });
  } catch (error) {
    console.error("Exam submission error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
