import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import Question from "./models/Question.js";
import questions from "./data/questions.js";
import examRoutes from "./routes/examRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config({ path: './.env' }); // Explicitly specify path if needed

console.log('JWT_SECRET:', process.env.JWT_SECRET); // This should now log your secret

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

// Catch-all handler for client-side routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

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

// const seedDatabase = async () => {
//     try {
//       const count = await Question.countDocuments();
//       if (count === 0) {
//         await Question.insertMany(questions);
//         console.log(" Questions added to the database.");
//       } else {
//         console.log("Questions already exist.");
//       }
//     } catch (error) {
//       console.error(" Error seeding database:", error);
//     }
//   };
  
//   seedDatabase();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
