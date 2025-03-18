import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import LoginPage from "./pages/LoginPage.js";
import RegisterPage from "./pages/RegisterPage.js";
import Dashboard from "./pages/Dashboard.js";
import ExamPage from "./pages/ExamPage.js";
import VerifyEmailPage from "./pages/VerifyEmailPage.js"; // New verification page
import AdminPanel from "./pages/AdminPanel.js";
import AdminLoginPage from "./pages/AdminLoginPage.js";
import AdminRegisterPage from "./pages/AdminRegisterPage.js";
import ProtectedRoute from "./components/ProtectedRoute.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* User Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/exam/:examId" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/register" element={<AdminRegisterPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
