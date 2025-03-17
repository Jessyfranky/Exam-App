import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import Question from "./models/Question.js";
import questions from "./data/questions.js";
import examRoutes from "./routes/examRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config({ path: './.env' });

// Create __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI || "mongodb+srv://frankjesse:Jesse123@cluster0.icdvq.mongodb.net/";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(" MongoDB Connection Error:", err));

app.use("/api/exam", examRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Serve static files from the React app build folder.
app.use(express.static(path.join(__dirname, "build")));

// Catch-all handler for client-side routing (React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
