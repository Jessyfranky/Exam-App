// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginUser } from "../services/api.js";
import "../styles/global.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect query parameter if available (e.g. ?redirect=/exam/EXAM-ABC123)
  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }

    setLoading(true);
    try {
      // Always log in as a normal user.
      const data = await loginUser(email, password, "user");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || "Login failed.");
    }
    setLoading(false);
  };

  return (
    <div className="container login-container">
      <h2>User Login</h2>
      <p style={{ marginBottom: "1rem", fontStyle: "italic" }}>
        Login to verify your account.
      </p>
      {error && <p className="error" style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer"
            }}
          >
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              style={{ marginRight: "5px" }}
            />
            Show
          </label>
        </div>
        {/* Optional: Display a reminder for password format */}
        <div style={{ marginBottom: "0.5rem", fontSize: "0.8rem", color: "#555" }}>
          <p>Password must be at least 8 characters and include uppercase, lowercase, and a symbol.</p>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "#007bff", textDecoration: "underline" }}>
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
