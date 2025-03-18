// src/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register endpoint for normal users
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Optional: set an expiry for the OTP (e.g., 10 minutes)
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    
    user = new User({
      name,
      email,
      password: hashedPassword,
      status: "pending",
      otp,
      otpExpires,
    });
    
    await user.save();
    
    // Send OTP via email (this is a placeholder - implement with your email service)
    // await sendEmail(email, "Your OTP Code", `Your OTP code is ${otp}`);
    console.log(`OTP for ${email}: ${otp}`); // For testing
    
    res.status(201).json({
      message: "User registered successfully. Please check your email for the OTP.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.status === "active") {
      return res.status(400).json({ message: "User is already verified" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    // Optional: Check if OTP has expired
    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    
    // Update user status and clear OTP fields
    user.status = "active";
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    // Generate a JWT token if needed.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    res.json({ message: "Email verified successfully", token, user });
  } catch (error) {
    console.error("OTP verification error:", error);
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
