// src/pages/AdminRegisterPage.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api.js";
import "../styles/global.css";

const AdminRegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirmPassword || !adminCode) {
      setError("All fields are required, including the admin code.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      // Register with role "admin" and pass the adminCode.
      const data = await registerUser(name, email, password, "admin", adminCode.trim());
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/admin"); // Redirect to admin panel after successful registration.
    } catch (err) {
      setError(err.message || "Admin registration failed.");
    }
    setLoading(false);
  };

  return (
    <div className="container login-container">
      <h2>Admin Registration</h2>
      <p>Please register using your admin credentials and admin code.</p>
      {error && <p className="error" style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleAdminRegister}>
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
        <input
          type="text"
          placeholder="Enter Admin Code"
          value={adminCode}
          onChange={(e) => setAdminCode(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register as Admin"}
        </button>
      </form>
      <p>
        Already have an admin account?{" "}
        <Link to="/admin/login" style={{ color: "#007bff", textDecoration: "underline" }}>
          Login as Admin
        </Link>
      </p>
    </div>
  );
};

export default AdminRegisterPage;