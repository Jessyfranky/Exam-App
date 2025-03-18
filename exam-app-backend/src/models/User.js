import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  status: { type: String, default: "pending" }, // pending until email is verified
  otp: { type: String },          // store OTP here
  otpExpires: { type: Date },     // and expiration time
});

export default mongoose.model("User", userSchema);
