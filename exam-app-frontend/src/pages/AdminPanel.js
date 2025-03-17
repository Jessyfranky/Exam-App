import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createExamConfig } from "../services/adminApi.js"; // API function to save exam configuration
import "../styles/global.css";

// Fixed subjects list.
const fixedSubjects = ["English", "Maths", "Physics", "Chemistry", "Biology"];

const AdminPanel = () => {
  const navigate = useNavigate();

  // Always call hooks at the top.
  const [adminName] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.name : "";
  });

  const [examConfig, setExamConfig] = useState({
    adminName: adminName,
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
  const [message, setMessage] = useState("");
  const [examId, setExamId] = useState(null);

  // Handler to switch subject.
  const handleSubjectChange = (subject) => {
    setCurrentSubject(subject);
    setMessage("");
    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: ""
    });
  };

  // Handlers for question input.
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

  // Add the current question to the selected subject.
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
    setExamConfig(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [currentSubject]: [...prev.subjects[currentSubject], currentQuestion]
      }
    }));
    setMessage(`Question ${examConfig.subjects[currentSubject].length + 1} added to ${currentSubject}.`);
    // Clear question input.
    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: ""
    });
  };

  // Convert subjects object to an array of subject objects.
  const buildSubjectsArray = () => {
    return Object.keys(examConfig.subjects).map(subjectName => ({
      name: subjectName,
      questions: examConfig.subjects[subjectName]
    }));
  };

  // Generate a unique exam link by saving the configuration.
  const handleGenerateExamLink = async () => {
    try {
      const configToSend = {
        adminName: examConfig.adminName,
        timer: examConfig.timer,
        subjects: buildSubjectsArray()
      };
      const savedConfig = await createExamConfig(configToSend);
      setExamId(savedConfig.examId);
      setMessage(`Exam configuration complete. Share this link: ${window.location.origin}/exam/${savedConfig.examId}`);
    } catch (error) {
      console.error("Error creating exam config:", error);
      setMessage("Error creating exam configuration.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Render the component content.
  return (
    <div className="container">
      {adminName ? (
        <>
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
                  setExamConfig(prev => ({ ...prev, timer: Number(e.target.value) }))
                }
              />
            </label>
          </div>
          <hr />

          {/* Fixed Subject Navigation */}
          <div className="subject-list">
            {fixedSubjects.map(subject => (
              <button
                key={subject}
                onClick={() => handleSubjectChange(subject)}
                style={{
                  background: currentSubject === subject ? "var(--accent-dark)" : "var(--accent-color)",
                  color: "#fff",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  margin: "0.25rem",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                {subject}
              </button>
            ))}
          </div>
          <hr />

          {/* Add Question Section */}
          <div style={{ textAlign: "left" }}>
            <h3>Add a Question to {currentSubject}</h3>
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
            <button type="button" onClick={handleAddQuestion}>
              Add Question
            </button>
          </div>
          <hr />

          {/* Grid Navigation for Current Subject */}
          <div className="grid-navigation">
            <h4>Questions in {currentSubject}:</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: "0.5rem" }}>
              {examConfig.subjects[currentSubject] &&
                examConfig.subjects[currentSubject].map((q, idx) => (
                  <div
                    key={idx}
                    className="grid-box"
                    onClick={() => { /* Optional: add navigation to view/edit question */ }}
                    style={{
                      padding: "0.5rem",
                      border: "1px solid #ccc",
                      textAlign: "center",
                      cursor: "pointer",
                      background: "#fff"
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

          {message && <p style={{ marginTop: "1rem", whiteSpace: "pre-wrap", color: "green" }}>{message}</p>}
          <hr />
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <div>
          <h2>Admin Panel</h2>
          <p>Admin not found. Please log in as admin.</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
