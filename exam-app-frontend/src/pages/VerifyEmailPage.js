// src/pages/VerifyEmailPage.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Retrieve the email from state passed during navigation.
  const { email } = location.state || {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    if (!otp) {
      setError("Please enter the OTP sent to your email.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/verify`, { email, otp });
      // If verification is successful, redirect to login.
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
    }
    setLoading(false);
  };

  return (
    <div className="container login-container">
      <h2>Email Verification</h2>
      <p style={{ marginBottom: "1rem" }}>
        An OTP has been sent to <strong>{email}</strong>. Please enter it below to verify your email.
      </p>
      {error && <p className="error" style={{ color: "red" }}>{error}</p>}
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
    </div>
  );
};

export default VerifyEmailPage;
