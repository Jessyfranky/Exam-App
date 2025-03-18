import mongoose from "mongoose";

const examConfigSchema = new mongoose.Schema({
  adminName: { type: String, required: true },
  examId: { type: String, required: true, unique: true },
  subjects: { type: Array, required: true }, // Each element should be an object with { name, questions }
  timer: { type: Number, default: 600 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ExamConfig", examConfigSchema);
