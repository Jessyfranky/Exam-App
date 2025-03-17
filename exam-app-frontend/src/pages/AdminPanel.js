// src/pages/AdminPanel.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createExamConfig } from "../services/adminApi.js"; // API function to save exam configuration
import "../styles/global.css";

// Fixed subjects list.
const fixedSubjects = ["English", "Maths", "Physics", "Chemistry", "Biology"];

const AdminPanel = () => {
  const navigate = useNavigate();

  // Always call hooks at the top.
  const [adminName, setAdminName] = useState("");
  const [examConfig, setExamConfig] = useState({
    adminName: "",
    timer: 600,
    subjects: fixedSubjects.reduce((acc, subject) => {
      acc[subject] = [];
      return acc;
    }, {})
  });
  const [currentSubject, setCurrentSubject] = useState(fixedSubjects[0]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: ""
  });
  // Holds the index of the currently loaded question (null if adding a new question).
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [message, setMessage] = useState("");
  const [examId, setExamId] = useState(null);

  // On mount, load admin's name and any saved exam configuration.
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setAdminName(user.name);
      setExamConfig((prev) => ({ ...prev, adminName: user.name }));
    }
    const storedConfig = localStorage.getItem("adminExamConfig");
    if (storedConfig) {
      setExamConfig(JSON.parse(storedConfig));
    }
  }, []);

  // If no adminName is found, show an error message.
  if (!adminName) {
    return (
      <div className="container">
        <h2>Admin Panel</h2>
        <p>Admin not found. Please log in as admin.</p>
      </div>
    );
  }

  // Handler to switch the current subject.
  const handleSubjectChange = (subject) => {
    setCurrentSubject(subject);
    setMessage("");
    setCurrentQuestion({ question: "", options: ["", "", "", ""], correctAnswer: "" });
    setCurrentQuestionIndex(null);
  };

  // Handlers for input changes.
  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, question: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleCorrectAnswerChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value });
  };

  // Helper: Save updated examConfig to localStorage.
  const persistConfig = (config) => {
    localStorage.setItem("adminExamConfig", JSON.stringify(config));
  };

  // Handler to add a new question.
  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim()) {
      setMessage("Please enter the question text.");
      return;
    }
    if (currentQuestion.options.some(opt => !opt.trim())) {
      setMessage("Please fill in all options.");
      return;
    }
    if (!currentQuestion.correctAnswer.trim()) {
      setMessage("Please specify the correct answer.");
      return;
    }
    setExamConfig((prev) => {
      const updatedSubjects = {
        ...prev.subjects,
        [currentSubject]: [...prev.subjects[currentSubject], currentQuestion]
      };
      const newConfig = { ...prev, subjects: updatedSubjects };
      persistConfig(newConfig);
      return newConfig;
    });
    setMessage(
      `Question ${examConfig.subjects[currentSubject].length + 1} added to ${currentSubject}.`
    );
    setCurrentQuestion({ question: "", options: ["", "", "", ""], correctAnswer: "" });
    setCurrentQuestionIndex(null);
  };

  // Handler to update an existing question.
  const handleUpdateQuestion = () => {
    if (currentQuestionIndex === null) return;
    setExamConfig((prev) => {
      const updatedQuestions = [...prev.subjects[currentSubject]];
      updatedQuestions[currentQuestionIndex] = currentQuestion;
      const newSubjects = { ...prev.subjects, [currentSubject]: updatedQuestions };
      const newConfig = { ...prev, subjects: newSubjects };
      persistConfig(newConfig);
      return newConfig;
    });
    setMessage(`Question ${currentQuestionIndex + 1} updated in ${currentSubject}.`);
    setCurrentQuestion({ question: "", options: ["", "", "", ""], correctAnswer: "" });
    setCurrentQuestionIndex(null);
  };

  // Handler to delete an existing question.
  const handleDeleteQuestion = () => {
    if (currentQuestionIndex === null) return;
    setExamConfig((prev) => {
      const updatedQuestions = [...prev.subjects[currentSubject]];
      updatedQuestions.splice(currentQuestionIndex, 1);
      const newSubjects = { ...prev.subjects, [currentSubject]: updatedQuestions };
      const newConfig = { ...prev, subjects: newSubjects };
      persistConfig(newConfig);
      return newConfig;
    });
    setMessage(`Question ${currentQuestionIndex + 1} deleted from ${currentSubject}.`);
    setCurrentQuestion({ question: "", options: ["", "", "", ""], correctAnswer: "" });
    setCurrentQuestionIndex(null);
  };

  // Clear the current question input.
  const handleClearQuestion = () => {
    setCurrentQuestion({ question: "", options: ["", "", "", ""], correctAnswer: "" });
    setCurrentQuestionIndex(null);
  };

  // Grid navigation: load a question into the input fields.
  const handleGoToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    const questionToLoad = examConfig.subjects[currentSubject][index];
    setCurrentQuestion(questionToLoad);
  };

  // Generate exam link by sending configuration to backend.
  const handleGenerateExamLink = async () => {
    try {
      const subjectsArray = Object.keys(examConfig.subjects).map((subjectName) => ({
        name: subjectName,
        questions: examConfig.subjects[subjectName],
      }));
      const configToSend = {
        adminName: examConfig.adminName,
        timer: examConfig.timer,
        subjects: subjectsArray,
      };
      const savedConfig = await createExamConfig(configToSend);
      setExamId(savedConfig.examId);
      setMessage(
        `Exam configuration complete. Share this link: ${window.location.origin}/exam/${savedConfig.examId}`
      );
      persistConfig({ ...examConfig, examId: savedConfig.examId });
    } catch (error) {
      console.error("Error creating exam config:", error);
      // Display a more descriptive error message:
      setMessage(`Error creating exam config: ${error.message || JSON.stringify(error)}`);
    }
  };

  // Logout: clear localStorage except for adminExamConfig so questions persist.
  const handleLogout = () => {
    const adminConfig = localStorage.getItem("adminExamConfig");
    localStorage.clear();
    if (adminConfig) {
      localStorage.setItem("adminExamConfig", adminConfig);
    }
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Admin Panel - Create Exam Configuration</h2>
      <p>Logged in as: {adminName}</p>
      
      {/* Timer Setting */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Exam Timer (seconds):{" "}
          <input
            type="number"
            value={examConfig.timer}
            onChange={(e) =>
              setExamConfig((prev) => ({ ...prev, timer: Number(e.target.value) }))
            }
          />
        </label>
      </div>
      <hr />

      {/* Fixed Subject Navigation */}
      <div className="subject-list">
        {fixedSubjects.map((subject) => (
          <button
            key={subject}
            onClick={() => handleSubjectChange(subject)}
            style={{
              background:
                currentSubject === subject ? "var(--accent-dark)" : "var(--accent-color)",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              margin: "0.25rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            {subject}
          </button>
        ))}
      </div>
      <hr />

      {/* Add/Edit Question Section */}
      <div style={{ textAlign: "left" }}>
        <h3>{currentQuestionIndex !== null ? "Edit" : "Add"} a Question to {currentSubject}</h3>
        <input
          type="text"
          placeholder="Question text"
          value={currentQuestion.question}
          onChange={handleQuestionChange}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        {currentQuestion.options.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
        ))}
        <input
          type="text"
          placeholder="Correct Answer"
          value={currentQuestion.correctAnswer}
          onChange={handleCorrectAnswerChange}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        {currentQuestionIndex !== null ? (
          <>
            <button type="button" onClick={handleUpdateQuestion}>
              Update Question
            </button>
            <button
              type="button"
              onClick={handleDeleteQuestion}
              style={{ marginLeft: "1rem" }}
            >
              Delete Question
            </button>
            <button
              type="button"
              onClick={handleClearQuestion}
              style={{ marginLeft: "1rem" }}
            >
              Clear
            </button>
          </>
        ) : (
          <button type="button" onClick={handleAddQuestion}>
            Add Question
          </button>
        )}
      </div>
      <hr />

      {/* Grid Navigation for Questions */}
      <div className="grid-navigation">
        <h4>Questions in {currentSubject}:</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: "0.5rem" }}>
          {examConfig.subjects[currentSubject] &&
            examConfig.subjects[currentSubject].map((q, idx) => (
              <div
                key={q.id || idx}
                className="grid-box"
                onClick={() => handleGoToQuestion(idx)}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                {idx + 1}
              </div>
            ))}
        </div>
      </div>
      <hr />

      {/* Generate Exam Link */}
      <div>
        <button onClick={handleGenerateExamLink}>Generate Exam Link</button>
        {examId && (
          <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
            Exam ID: {examId}
            <br />
            <a href={`${window.location.origin}/exam/${examId}`}>
              {window.location.origin}/exam/{examId}
            </a>
          </div>
        )}
      </div>

      {message && (
        <p style={{ marginTop: "1rem", whiteSpace: "pre-wrap", color: "green" }}>
          {message}
        </p>
      )}
      <hr />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminPanel;
