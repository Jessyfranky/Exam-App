// src/pages/AdminLoginPage.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api.js";
import "../styles/global.css";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !adminCode) {
      setError("Please fill in all fields, including the admin code.");
      return;
    }
    setLoading(true);
    try {
      // Pass the admin code along with email, password, and role "admin".
      const data = await loginUser(email, password, "admin", adminCode.trim());
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/admin"); // Navigate to the admin panel.
    } catch (err) {
      setError(err.message || "Admin login failed.");
    }
    setLoading(false);
  };

  return (
    <div className="container login-container">
      <h2>Admin Login</h2>
      <p>Please enter your credentials and admin code.</p>
      {error && <p className="error" style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleAdminLogin}>
        <input
          type="email"
          placeholder="Admin Email"
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
          type="text"
          placeholder="Enter Admin Code"
          value={adminCode}
          onChange={(e) => setAdminCode(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
      </form>
      <p>
        Don't have an admin account?{" "}
        <Link to="/admin/register" style={{ color: "#007bff", textDecoration: "underline" }}>
          Register as Admin
        </Link>
      </p>
    </div>
  );
};

export default AdminLoginPage;
