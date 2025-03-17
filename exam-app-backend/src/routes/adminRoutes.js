import express from "express";
import ExamConfig from "../models/ExamConfig.js";

const router = express.Router();

router.post("/config", async (req, res) => {
  try {
    const { adminName, subjects, timer } = req.body;
    const examId = "EXAM-" + adminName.replace(/\s/g, "") + "-" + Math.floor(Math.random() * 1000000) + "-" + Date.now();
    const examConfig = new ExamConfig({ adminName, examId, subjects, timer });
    await examConfig.save();
    res.status(201).json(examConfig);
  } catch (error) {
    console.error("Error creating exam config:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});



router.post("/config/subject", async (req, res) => {
  try {
    const { adminName, subject, questions, timer } = req.body; // Remove adminId
    
    if (!adminName || !subject || !questions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Generate a unique `examId` for the subject
    const examId = subject + "-" + Date.now();

    const examConfig = new ExamConfig({
      adminName, // Store adminName instead of adminId
      examId,
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
    res.status(500).json({ message: error.message || "Server error" });
  }
});

router.post("/admin/register", async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;
    
    // Validate admin code
    if (adminCode !== process.env.ADMIN_CODE) {
      return res.status(403).json({ message: "Invalid admin code" });
    }
    
    // Check if admin already exists
    let adminUser = await User.findOne({ email });
    if (adminUser) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    
    // Hash password and create admin user with role "admin"
    const hashedPassword = await bcrypt.hash(password, 10);
    adminUser = new User({ name, email, password: hashedPassword, role: "admin" });
    await adminUser.save();
    
    // Generate JWT token
    const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ message: "Admin registered successfully", user: adminUser, token });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin Login Route
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password, adminCode } = req.body;
    
    // Find admin user by email
    const adminUser = await User.findOne({ email });
    if (!adminUser) {
      return res.status(400).json({ message: "Admin not found" });
    }
    
    // Verify that the user's role is admin
    if (adminUser.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }
    
    // Validate admin code
    if (adminCode !== process.env.ADMIN_CODE) {
      return res.status(403).json({ message: "Invalid admin code" });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Admin logged in successfully", user: adminUser, token });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
