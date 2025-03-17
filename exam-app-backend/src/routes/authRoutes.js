// src/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register endpoint for normal users
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Reject if role is set to "admin" - admin registration should be separate.
    if (role && role === "admin") {
      return res.status(403).json({ message: "Admin registration is not allowed via this route." });
    }
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    // Set role to "user" regardless of what was passed.
    user = new User({ name, email, password: hashedPassword, role: "user" });
    await user.save();
    
    // Generate token.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ message: "User registered successfully", user, token });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login endpoint for normal users
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Reject if the login attempt is for admin.
    if (role && role === "admin") {
      return res.status(403).json({ message: "Admin login is not allowed via this route." });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    // Ensure the user's role is "user"
    if (user.role !== "user") {
      return res.status(400).json({ message: "Invalid credentials for this role" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
