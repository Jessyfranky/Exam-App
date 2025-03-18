import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  status: { type: String, default: "pending" }, // "pending" until email verified
  otp: { type: String }, // store OTP (in production, consider storing a hash of the OTP)
  otpExpires: { type: Date }, // optional expiration time
});

export default mongoose.model("User", userSchema);
