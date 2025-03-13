import mongoose from "mongoose";

const examConfigSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  examId: { type: String, required: true, unique: true }, // Unique exam key
  subjects: [{
    name: { type: String, required: true },
    compulsory: { type: Boolean, default: false },
    questions: [{
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true }
    }]
  }],
  timer: { type: Number, default: 600 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ExamConfig", examConfigSchema);
