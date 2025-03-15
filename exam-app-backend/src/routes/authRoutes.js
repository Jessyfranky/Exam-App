import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, adminCode } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (role === "admin") {
      if (adminCode.trim() !== process.env.ADMIN_CODE) {
        return res.status(403).json({ message: "Invalid admin code" });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role: role || "user" });
    await user.save();
    // Generate token.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ message: "User registered successfully", user, token });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login endpoint: POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role, adminCode } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.role !== role) {
      return res.status(400).json({ message: "Invalid credentials for this role" });
    }
    // If logging in as admin, check the provided admin code.
    if (role === "admin") {
      if (!adminCode || adminCode.trim() !== process.env.ADMIN_CODE) {
        return res.status(403).json({ message: "Invalid admin code" });
      }
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
