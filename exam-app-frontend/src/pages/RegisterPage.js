// src/pages/RegisterPage.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// Optionally, import a Google OAuth component/library
import { GoogleLogin } from "@react-oauth/google";
import { registerUser } from "../services/api.js";
import "../styles/global.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  
  // Local state for manual registration.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle manual registration.
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setLoading(true);
    try {
      // Here, your backend should mark the new user as "pending" and send an OTP email.
      const data = await registerUser(name, email, password, "user");
      // After registration, navigate to an OTP verification page.
      navigate("/verify-email");
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
      <form onSubmit={handleRegister}>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
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
        <Link to="/login" style={{ color: "#007bff", textDecoration: "underline" }}>
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
