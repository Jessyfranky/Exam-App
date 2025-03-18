// src/pages/VerifyEmailPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  // Countdown timer in seconds (10 minutes = 600 seconds)
  const [countdown, setCountdown] = useState(600);

  // Timer countdown effect.
  useEffect(() => {
    if (countdown <= 0) return;
    const timerId = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [countdown]);

  // Format time as MM:SS.
  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    if (!otp) {
      setError("Please enter the OTP sent to your email.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || "https://exam-app-mj2m.onrender.com/api"}/auth/verify`,
        { email, otp }
      );
      // On success, redirect to login or dashboard
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || "https://exam-app-mj2m.onrender.com/api"}/auth/resend-otp`,
        { email }
      );
      setMessage("A new OTP has been sent to your email.");
      // Reset countdown timer to 10 minutes.
      setCountdown(600);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    }
    setResendLoading(false);
  };

  return (
    <div className="container login-container">
      <h2>Email Verification</h2>
      <p>
        An OTP has been sent to <strong>{email}</strong>. Please enter it below to verify your email.
      </p>
      {error && <p className="error" style={{ color: "red" }}>{error}</p>}
      {message && <p className="message" style={{ color: "green" }}>{message}</p>}
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
      <div style={{ marginTop: "1rem" }}>
        {countdown > 0 ? (
          <p>Resend OTP in: {formatTime(countdown)}</p>
        ) : (
          <button onClick={handleResendOTP} disabled={resendLoading}>
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
