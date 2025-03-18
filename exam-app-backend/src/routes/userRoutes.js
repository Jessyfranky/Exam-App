import express from "express";
import User from "../models/User.js"; // Ensure you have a User model

const router = express.Router();

// GET /api/users/:id - Fetch user data by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
