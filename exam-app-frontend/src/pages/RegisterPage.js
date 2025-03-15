import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api.js";
import "../styles/global.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Role selection defaults to "user"
  const [role, setRole] = useState("user");
  // Field for admin code; only used if role is "admin"
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    // If admin is selected, ensure the admin code is provided.
    if (role === "admin" && !adminCode.trim()) {
      setError("Admin code is required for admin registration.");
      return;
    }

    setLoading(true);
    try {
      // Send adminCode if role is admin.
      const data = await registerUser(
        name,
        email,
        password,
        role,
        role === "admin" ? adminCode.trim() : undefined
      );
      // Store the user data.
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      // If the user is an admin, navigate directly to the admin panel.
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
    setLoading(false);
  };

  return (
    <div className="container login-container">
      <h2>Register</h2>
      <p style={{ marginBottom: "1rem" }}>
        Register as <strong>{role === "admin" ? "Admin" : "User"}</strong>
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
        {/* Admin Code Field: Only visible if admin is selected */}
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
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
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
