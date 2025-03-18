import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  // Optionally, store exam scores and other info
  scores: [{ subject: String, score: Number }],
});

export default mongoose.model("User", userSchema);
