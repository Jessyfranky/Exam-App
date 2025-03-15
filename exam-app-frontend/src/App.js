import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.js";
import HomePage from "./pages/HomePage.js";
import RegisterPage from "./pages/RegisterPage.js";
import Dashboard from "./pages/Dashboard.js";
import ExamPage from "./pages/ExamPage.js";
import AdminPanel from "./pages/AdminPanel.js";
import ProtectedRoute from "./components/ProtectedRoute.js";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        {/* Wrap your exam route to force login */}
        <Route path="/exam/:examId" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

