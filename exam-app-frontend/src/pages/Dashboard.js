import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../services/api.js";
import examQuestions from "../data/questions.js";
import "../styles/global.css";

const availableSubjects = ["English", "Maths", "Chemistry", "Biology", "Physics"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  // State for subject selection; if already saved and complete, we skip selection.
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjectError, setSubjectError] = useState("");
  const [selectionCompleted, setSelectionCompleted] = useState(false);
  const [calculatedScores, setCalculatedScores] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user) {
      navigate("/login");
      return;
    }
    fetchUserData(user._id, token)
      .then((data) => setUserData(data))
      .catch((err) => console.error("Error fetching user data:", err));

    // Check if subjects have been previously saved and are valid.
    const storedSubjectsStr = localStorage.getItem("selectedSubjects");
    if (storedSubjectsStr) {
      try {
        const storedSubjects = JSON.parse(storedSubjectsStr);
        if (Array.isArray(storedSubjects) && storedSubjects.length === 4) {
          setSelectedSubjects(storedSubjects);
          setSelectionCompleted(true);
        } else {
          setSelectedSubjects(["English"]);
        }
      } catch (err) {
        setSelectedSubjects(["English"]);
      }
    } else {
      // For new users, default English as compulsory.
      setSelectedSubjects(["English"]);
    }

    // Calculate exam scores from stored exam answers, if available.
    const examAnswers = JSON.parse(localStorage.getItem("examAnswers"));
    if (examAnswers) {
      const scores = {};
      Object.keys(examAnswers).forEach((subject) => {
        const subjectQuestions = examQuestions[subject] || [];
        const subjectUserAnswers = examAnswers[subject];
        let correctCount = 0;
        subjectQuestions.forEach((q) => {
          if (subjectUserAnswers && subjectUserAnswers[q.id] === q.correctAnswer) {
            correctCount++;
          }
        });
        scores[subject] = correctCount;
      });
      setCalculatedScores(scores);
    }
  }, [navigate]);

  // Toggle subject selection (only allowed if selection is not completed).
  const handleToggleSubject = (subject) => {
    if (selectionCompleted) return; // Do nothing if selection already saved.
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

  // Save the selected subjects if exactly 4 are selected.
  const handleSaveSubjects = (e) => {
    e.preventDefault();
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
  };

  const handleTakeExam = () => {
    navigate("/exam");
  };

  // Retake exam: clear only exam answers so that users retake exam with the same subjects.
  const handleRetakeExam = () => {
    localStorage.removeItem("examAnswers");
    setCalculatedScores({});
    navigate("/exam");
  };

  // Modified logout: preserve the selected subjects.
  const handleLogout = () => {
    const subjects = localStorage.getItem("selectedSubjects");
    localStorage.clear();
    if (subjects) localStorage.setItem("selectedSubjects", subjects);
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>
      {userData ? (
        <div className="profile-section">
          <p>Welcome, {userData.name}</p>
          <p>Email: {userData.email}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
      <hr />

      {!selectionCompleted ? (
        <div className="subject-selection-section">
          <h3>Select Exam Subjects</h3>
          <p>
            Please select exactly 4 subjects from: {availableSubjects.join(", ")}.
            <br />English is compulsory.
          </p>
          <div className="subject-list">
            {availableSubjects.map((subject) => (
              <label key={subject} className="subject-item" style={{ cursor: subject === "English" ? "not-allowed" : "pointer" }}>
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
          {subjectError && <p className="error">{subjectError}</p>}
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
        </div>
      )}
      <hr />

      {Object.keys(calculatedScores).length > 0 && (
        <div className="score-section">
          <h3>Your Exam Scores</h3>
          {Object.keys(calculatedScores).map((subject) => (
            <div key={subject} className="score-item">
              <h4>{subject}</h4>
              <p>
                Score: {calculatedScores[subject]} / {examQuestions[subject].length}
              </p>
            </div>
          ))}
          <button onClick={handleRetakeExam}>Retake Exam</button>
        </div>
      )}
      <hr />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
