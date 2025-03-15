// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/global.css";

const availableSubjects = ["English", "Maths", "Chemistry", "Biology", "Physics"];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const examIdFromQuery = new URLSearchParams(location.search).get("examId") || localStorage.getItem("examId") || "";

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjectError, setSubjectError] = useState("");
  const [selectionCompleted, setSelectionCompleted] = useState(false);
  const [examScores, setExamScores] = useState(JSON.parse(localStorage.getItem("examScores")) || {});
  const [examLinkInput, setExamLinkInput] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem("selectedSubjects"));
    if (storedSubjects && storedSubjects.length === 4) {
      setSelectedSubjects(storedSubjects);
      setSelectionCompleted(true);
    } else {
      setSelectedSubjects(["English"]);
    }
  }, []);

  useEffect(() => {
    const examAnswers = JSON.parse(localStorage.getItem("examAnswers"));
    const adminExamConfig = JSON.parse(localStorage.getItem("adminExamConfig"));
    if (examAnswers && adminExamConfig && adminExamConfig.subjects) {
      let scores = {};
      adminExamConfig.subjects.forEach((sub) => {
        if (selectedSubjects.includes(sub.name)) {
          let correct = 0;
          let total = sub.questions.length;
          sub.questions.forEach((q) => {
            if (examAnswers[sub.name] && examAnswers[sub.name][q.id] === q.correctAnswer) {
              correct++;
            }
          });
          scores[sub.name] = `${correct} / ${total} (${Math.round((correct/total)*100)}%)`;
        }
      });
      setExamScores(scores);
      localStorage.setItem("examScores", JSON.stringify(scores));
    }
  }, [selectedSubjects]);

  const handleSaveSubjects = () => {
    if (selectedSubjects.length !== 4) {
      setSubjectError("Please select exactly 4 subjects (English plus 3 others). ");
      return;
    }
    localStorage.setItem("selectedSubjects", JSON.stringify(selectedSubjects));
    setSelectionCompleted(true);
    setMessage("Subjects saved successfully.");
  };

  const handleLoadExam = () => {
    let examId = examIdFromQuery || examLinkInput.trim();
    if (!examId) {
      setMessage("No exam link found. Please enter an exam link or exam ID.");
      return;
    }
    localStorage.setItem("examId", examId);
    navigate(`/exam/${examId}`);
  };

  const handleRetakeExam = () => {
    localStorage.removeItem("examAnswers");
    localStorage.removeItem("examScores");
    setExamScores({});
    if (examIdFromQuery) {
      navigate(`/exam/${examIdFromQuery}`);
    } else {
      setMessage("No exam link found.");
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p>Welcome! Your selected subjects and exam scores are below.</p>

      {selectionCompleted ? (
        <div>
          <h3>Your Selected Subjects</h3>
          <div className="subject-list">
            {selectedSubjects.map(subject => (
              <div key={subject} className="subject-item">{subject}</div>
            ))}
          </div>
          <p>Your subjects have been set and cannot be changed.</p>
        </div>
      ) : (
        <div>
          <h3>Select 4 Subjects (English is compulsory)</h3>
          <div className="subject-list">
            {availableSubjects.map(subject => (
              <label key={subject} className="subject-item">
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject)}
                  onChange={() => {
                    if (selectionCompleted || subject === "English") return;
                    setSelectedSubjects(prev => prev.includes(subject)
                      ? prev.filter(s => s !== subject)
                      : prev.length < 4 ? [...prev, subject] : prev);
                  }}
                  disabled={selectionCompleted || subject === "English"}
                />
                {subject} {subject === "English" && "(Compulsory)"}
              </label>
            ))}
          </div>
          {subjectError && <p className="error" style={{ color: "red" }}>{subjectError}</p>}
          <button onClick={handleSaveSubjects} disabled={selectionCompleted}>Save Subjects</button>
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Enter Exam Link or Exam ID"
          value={examLinkInput}
          onChange={(e) => setExamLinkInput(e.target.value)}
        />
        <button onClick={handleLoadExam}>Take Exam</button>
      </div>

      {Object.keys(examScores).length > 0 && (
        <div className="score-section" style={{ marginTop: "2rem" }}>
          <h3>Your Exam Scores</h3>
          {Object.keys(examScores).map(subject => (
            <div key={subject} className="score-item">
              <h4>{subject}</h4>
              <p>Score: {examScores[subject]}</p>
            </div>
          ))}
        </div>
      )}

      {message && <p style={{ color: "red" }}>{message}</p>}
      <button onClick={handleRetakeExam} style={{ marginTop: "1rem" }}>Retake Exam</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
