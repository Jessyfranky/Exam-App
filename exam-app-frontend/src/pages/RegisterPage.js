// src/pages/RegisterPage.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api.js";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/global.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  // Form state.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Password validation (guide)
  const isMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    // Validate required fields.
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!(isMinLength && hasUppercase && hasLowercase && hasSymbol)) {
      setError("Password does not meet the required criteria.");
      return;
    }

    setLoading(true);
    try {
      // Call registration endpoint.
      // Backend should mark the user as "pending" and send an OTP to their email.
      await registerUser(name, email, password, "user");
      alert("OTP has been sent to your email. Please check your inbox.");
      // Navigate to the OTP verification page, passing the email.
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
    setLoading(false);
  };
 // Handle Google Sign-In success.
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send credentialResponse.credential (JWT) to your backend to verify and create/log in the user.
      // The backend should create the user record with an active status.
      // For example:
      // const data = await googleLogin(credentialResponse.credential);
      // localStorage.setItem("token", data.token);
      // localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      setError("Google sign-in failed.");
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-in was unsuccessful. Please try again.");
  };

  return (
    <div className="container login-container">
      <h2>Register</h2>
      <p style={{ marginBottom: "1rem" }}>
        Register as <strong>User</strong>
      </p>
      {error && <p className="error" style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSendOTP}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Password Guidelines */}
        <div style={{ marginBottom: "0.5rem" }}>
          <p style={{ color: isMinLength ? "green" : "red", margin: 0 }}>
            {isMinLength ? "✓" : "✗"} At least 8 characters
          </p>
          <p style={{ color: hasUppercase ? "green" : "red", margin: 0 }}>
            {hasUppercase ? "✓" : "✗"} At least one uppercase letter
          </p>
          <p style={{ color: hasLowercase ? "green" : "red", margin: 0 }}>
            {hasLowercase ? "✓" : "✗"} At least one lowercase letter
          </p>
          <p style={{ color: hasSymbol ? "green" : "red", margin: 0 }}>
            {hasSymbol ? "✓" : "✗"} At least one symbol
          </p>
        </div>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
           <p style={{ marginTop: "1rem" }}>
        Or continue with Google:
      </p>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />
      <p style={{ marginTop: "1rem" }}>
        Already have an account?{" "}
        <Link
          to="/login"
          style={{ color: "#007bff", textDecoration: "underline" }}
        >
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
