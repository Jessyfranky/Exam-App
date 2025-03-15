// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/global.css";

const availableSubjects = ["English", "Maths", "Chemistry", "Biology", "Physics"];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State to hold user's selected subjects.
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjectError, setSubjectError] = useState("");
  // Flag indicating whether subject selection is complete.
  const [selectionCompleted, setSelectionCompleted] = useState(false);
  // State for exam scores.
  const [examScores, setExamScores] = useState({});
  // Message state.
  const [message, setMessage] = useState("");

  // On mount, check localStorage for subject selection.
  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem("selectedSubjects"));
    if (storedSubjects && storedSubjects.length === 4) {
      setSelectedSubjects(storedSubjects);
      setSelectionCompleted(true);
    } else {
      // For new users, default to English (compulsory).
      setSelectedSubjects(["English"]);
    }
  }, []);

  // On mount, if exam answers and admin exam configuration exist, compute scores.
  useEffect(() => {
    const examAnswers = JSON.parse(localStorage.getItem("examAnswers"));
    const adminExamConfig = JSON.parse(localStorage.getItem("adminExamConfig"));
    if (examAnswers && adminExamConfig && adminExamConfig.subjects) {
      // Compute scores for subjects that the user selected.
      const scores = {};
      adminExamConfig.subjects.forEach((subject) => {
        // Only compute score if this subject was selected.
        if (selectedSubjects.includes(subject.name)) {
          const userAnswers = examAnswers[subject.name] || {};
          const total = subject.questions.length;
          let correct = 0;
          subject.questions.forEach((q) => {
            if (userAnswers[q.id] && userAnswers[q.id] === q.correctAnswer) {
              correct++;
            }
          });
          // You can compute a percentage or simply the raw count.
          scores[subject.name] = `${correct} / ${total} (${Math.round((correct/total)*100)}%)`;
        }
      });
      setExamScores(scores);
    }
  }, [selectedSubjects]);

  // Handler to toggle subject selection (except English).
  const handleToggleSubject = (subject) => {
    if (selectionCompleted) return; // Locked once saved.
    if (subject === "English") return; // English is compulsory.
    
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

  // "Retake Exam" clears exam answers (preserving subject selection).
  const handleRetakeExam = () => {
    localStorage.removeItem("examAnswers");
    setExamScores({});
    // Navigate to exam page using a stored exam ID if available.
    // For this snippet, we assume exam ID is provided elsewhere.
    navigate("/exam/your_exam_id_here"); // Replace with your exam navigation logic.
  };

  // Logout: clear all localStorage.
  const handleLogout = () => {
    localStorage.clear();
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
              <div key={subject} className="subject-item">
                {subject}
              </div>
            ))}
          </div>
          <p>Your subjects have been set. You cannot change them now.</p>
          <button onClick={handleRetakeExam}>Retake Exam</button>
        </div>
      )}

      {/* Exam Scores Section */}
      {Object.keys(examScores).length > 0 && (
        <div className="score-section" style={{ marginTop: "2rem" }}>
          <h3>Your Exam Scores</h3>
          {Object.keys(examScores).map((subject) => (
            <div key={subject} className="score-item">
              <h4>{subject}</h4>
              <p>Score: {examScores[subject]}</p>
            </div>
          ))}
        </div>
      )}

      {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
      <hr />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
