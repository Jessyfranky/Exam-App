import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.js";           // Normal user login
import RegisterPage from "./pages/RegisterPage.js";       // Normal user registration
import Dashboard from "./pages/Dashboard.js";
import ExamPage from "./pages/ExamPage.js";
import AdminLoginPage from "./pages/AdminLoginPage.js";   // Admin login
import AdminRegisterPage from "./pages/AdminRegisterPage.js"; // Admin registration
import AdminPanel from "./pages/AdminPanel.js";           // Admin panel
import ProtectedRoute from "./components/ProtectedRoute.js";

function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/exam/:examId"
          element={<ProtectedRoute><ExamPage /></ProtectedRoute>}
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/register" element={<AdminRegisterPage />} />
        <Route
          path="/admin"
          element={<ProtectedRoute><AdminPanel /></ProtectedRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;
