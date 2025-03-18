// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/global.css";

const availableSubjects = ["English", "Maths", "Chemistry", "Biology", "Physics"];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Try to read examId from query parameter; if not, from localStorage.
  const examIdFromQuery = new URLSearchParams(location.search).get("examId") || localStorage.getItem("examId") || "";

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjectError, setSubjectError] = useState("");
  const [selectionCompleted, setSelectionCompleted] = useState(false);
  const [examScores, setExamScores] = useState(JSON.parse(localStorage.getItem("examScores")) || {});
  const [examLinkInput, setExamLinkInput] = useState("");
  const [message, setMessage] = useState("");

  // On mount, load user's subject selection from localStorage.
  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem("selectedSubjects"));
    if (storedSubjects && storedSubjects.length === 4) {
      setSelectedSubjects(storedSubjects);
      setSelectionCompleted(true);
    } else {
      // Default for new users.
      setSelectedSubjects(["English"]);
    }
  }, []);

  // Handler to toggle subject selection (except English).
  const handleToggleSubject = (subject) => {
    if (selectionCompleted) return;
    if (subject === "English") return;

    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      if (selectedSubjects.length >= 4) {
        setSubjectError("You can only select 4 subjects (English plus 3 others).");
        return;
      }
      setSelectedSubjects([...selectedSubjects, subject]);
    }
    setSubjectError("");
  };

  // Handler to save subjects.
  const handleSaveSubjects = () => {
    if (selectedSubjects.length !== 4) {
      setSubjectError("Please select exactly 4 subjects (English plus 3 others).");
      return;
    }
    if (!selectedSubjects.includes("English")) {
      setSubjectError("English is compulsory.");
      return;
    }
    localStorage.setItem("selectedSubjects", JSON.stringify(selectedSubjects));
    setSelectionCompleted(true);
    setMessage("Subjects saved successfully.");
  };

  // Handler to load exam from exam link or exam ID.
  const handleLoadExam = () => {
    let examId = examIdFromQuery;
    // If no examId is found in query or localStorage, check input field.
    if (!examId && examLinkInput.trim()) {
      try {
        // If the input is a full URL, extract the exam ID.
        const url = new URL(examLinkInput.trim());
        const segments = url.pathname.split("/");
        examId = segments[segments.length - 1];
      } catch (error) {
        // If not a valid URL, assume the input is directly the exam ID.
        examId = examLinkInput.trim();
      }
    }
    if (!examId) {
      setMessage("No exam link found. Please enter an exam link or exam ID.");
      return;
    }
    // Optionally, save the examId to localStorage for later use.
    localStorage.setItem("examId", examId);
    navigate(`/exam/${examId}`);
  };

  // Handler for retaking exam.
  const handleRetakeExam = () => {
    localStorage.removeItem("examAnswers");
    setExamScores({});
    if (examIdFromQuery) {
      navigate(`/exam/${examIdFromQuery}`);
    } else {
      setMessage("No exam link found.");
    }
  };

  // Updated Logout: clear authentication data but preserve subject selection.
  const handleLogout = () => {
    // Remove only user-specific auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Optionally remove examId and examAnswers if desired
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p>Welcome! Please select your preferred exam subjects.</p>

      {/* Subject Selection Section */}
      {!selectionCompleted ? (
        <div className="subject-selection-section">
          <h3>Select 4 Subjects (English is compulsory)</h3>
          <div className="subject-list">
            {availableSubjects.map((subject) => (
              <label
                key={subject}
                className="subject-item"
                style={{ cursor: subject === "English" ? "not-allowed" : "pointer" }}
              >
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject)}
                  onChange={() => handleToggleSubject(subject)}
                  disabled={subject === "English"}
                  style={{ marginRight: "0.5rem" }}
                />
                {subject} {subject === "English" && "(Compulsory)"}
              </label>
            ))}
          </div>
          {subjectError && <p className="error" style={{ color: "red" }}>{subjectError}</p>}
          <button onClick={handleSaveSubjects}>Save Subjects</button>
        </div>
      ) : (
        <div className="exam-ready-section">
          <h3>Your Selected Subjects</h3>
          <div className="subject-list">
            {selectedSubjects.map((subject) => (
              <div key={subject} className="subject-item">{subject}</div>
            ))}
          </div>
          <p>Your subjects have been set and cannot be changed now.</p>
          <div style={{ marginTop: "1rem" }}>
            <input
              type="text"
              placeholder="Enter Exam Link or Exam ID"
              value={examLinkInput}
              onChange={(e) => setExamLinkInput(e.target.value)}
              style={{ width: "70%", marginRight: "1rem" }}
            />
            <button onClick={handleLoadExam}>Take Exam</button>
          </div>
          <button onClick={handleRetakeExam} style={{ marginTop: "1rem" }}>Retake Exam</button>
        </div>
      )}

      {message && <p style={{ marginTop: "1rem", color: "red" }}>{message}</p>}
      <hr />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
