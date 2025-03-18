import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    enum: ["Maths", "English", "Chemistry", "Economics", "Physics", "History"], // Restrict subjects
  },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], // Multiple-choice options
  correctAnswer: { type: String, required: true }, // Store correct answer
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
