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
  // Role selection defaults to "user"
  const [role, setRole] = useState("user");
  // Admin code state; only used if role is "admin"
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }
    // If admin is selected, ensure the admin code is provided.
    if (role === "admin" && !adminCode.trim()) {
      setError("Admin code is required for admin login.");
      return;
    }

    setLoading(true);
    try {
      // Pass adminCode only when role is admin.
      const data = await loginUser(email, password, role, role === "admin" ? adminCode.trim() : undefined);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // If the user is an admin, navigate to the admin panel.
      // Otherwise, navigate using the redirectPath (which could be an exam link or the dashboard).
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || "Login failed.");
    }
    setLoading(false);
  };

  return (
    <div className="container login-container">
      <h2>{role === "admin" ? "Admin Login" : "User Login"}</h2>
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
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Role Selection */}
        <div style={{ margin: "1rem 0" }}>
          <label style={{ marginRight: "1rem" }}>
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === "user"}
              onChange={(e) => setRole(e.target.value)}
            />
            User
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === "admin"}
              onChange={(e) => setRole(e.target.value)}
            />
            Admin
          </label>
        </div>
        {/* Admin Code Field: Visible only when role is "admin" */}
        {role === "admin" && (
          <input
            type="text"
            placeholder="Enter Admin Code"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
        )}
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
