import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
});

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  questions: { type: [questionSchema], default: [] },
});

const examConfigSchema = new mongoose.Schema({
  adminName: { type: String, required: true },
  examId: { type: String, required: true, unique: true },
  subjects: { type: [subjectSchema], required: true },
  timer: { type: Number, default: 600 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ExamConfig", examConfigSchema);
