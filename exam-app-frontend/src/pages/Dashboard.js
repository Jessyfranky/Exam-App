import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../services/api.js";
import examQuestions from "../data/questions.js"; // used for score calculations later
import "../styles/global.css";

const availableSubjects = ["English", "Maths", "Chemistry", "Biology", "Physics"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  // For subject selection:
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

    // If the user has already selected subjects, load them.
    const storedSubjects = JSON.parse(localStorage.getItem("selectedSubjects"));
    if (storedSubjects && storedSubjects.length === 4) {
      setSelectedSubjects(storedSubjects);
      setSelectionCompleted(true);
    } else {
      // Preselect English as compulsory.
      setSelectedSubjects(["English"]);
    }

    // Optionally, if exam answers exist, calculate scores.
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

  // Toggle a subject's selection (except English, which is compulsory).
  const handleToggleSubject = (subject) => {
    if (subject === "English") return;
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      // Ensure the total doesn't exceed 4.
      if (selectedSubjects.length >= 4) {
        setSubjectError("You can only select 4 subjects.");
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
      setSubjectError("Please select exactly 4 subjects. (English plus 3 others)");
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

  const handleRetakeExam = () => {
    localStorage.removeItem("examAnswers");
    localStorage.removeItem("selectedSubjects");
    setSelectionCompleted(false);
    setSelectedSubjects(["English"]);
    setCalculatedScores({});
  };

  const handleLogout = () => {
    localStorage.clear();
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

      {selectionCompleted ? (
        <div className="exam-ready-section">
          <h3>Selected Subjects</h3>
          <div className="subject-list">
            {selectedSubjects.map((subject) => (
              <div key={subject} className="subject-item">
                {subject}
              </div>
            ))}
          </div>
          <button onClick={handleTakeExam}>Take Exam</button>
        </div>
      ) : (
        <div className="subject-selection-section">
          <h3>Select 4 Subjects for Your Exam</h3>
          <p>
            Choose 4 subjects from: {availableSubjects.join(", ")}. <br />
            Note: English is compulsory.
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
      )}
      <hr />

      {/* Exam Scores Section */}
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
