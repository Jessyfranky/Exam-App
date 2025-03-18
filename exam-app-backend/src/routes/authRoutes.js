// src/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOTPEmail } from "../sendEmail.js";


const router = express.Router();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate OTP and set expiration (10 minutes)
    const otp = generateOTP(); // e.g., "832870"
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    
    user = new User({
      name,
      email,
      password: hashedPassword,
      status: "pending",
      otp,         // This should be stored
      otpExpires,  // And its expiration time
    });
    
    await user.save();
    
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }
    
    res.status(201).json({ message: "User registered successfully. Please verify your email using the OTP sent." });
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
    console.log("Stored OTP:", user.otp);
    console.log("Received OTP:", otp);
    if (user.otp.trim() !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    
    user.status = "active";
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Email verified successfully", token, user });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // If the user is already verified, no need to resend OTP.
    if (user.status === "active") {
      return res.status(400).json({ message: "User is already verified." });
    }

    // Generate new OTP and expiration (10 minutes from now)
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Update user record with the new OTP and expiration time
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send the OTP via email
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP." });
    }

    res.json({ message: "OTP resent successfully. Please check your email." });
  } catch (error) {
    console.error("Error in /auth/resend-otp:", error);
    res.status(500).json({ message: "Server error." });
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
