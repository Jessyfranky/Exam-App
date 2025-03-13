import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createExamConfig, saveSubjectConfig } from "../services/adminApi.js"; // Ensure saveSubjectConfig exists
import "../styles/global.css";

// Admin can add any subject (not limited to a predefined list)
const AdminPanel = () => {
  const navigate = useNavigate();

  // Overall exam configuration state
  const [examConfig, setExamConfig] = useState({
    adminId: "", // Ideally set from logged-in admin info
    timer: 600,  // Default timer in seconds; admin can update
    subjects: {} // Format: { subjectName: [question, question, ...], ... }
  });

  // State for new subject addition
  const [newSubject, setNewSubject] = useState("");
  // List of subjects that have been added (keys of examConfig.subjects)
  const subjectsAdded = Object.keys(examConfig.subjects);
  // State for current subject selected for adding questions
  const [currentSubject, setCurrentSubject] = useState("");
  // State for current question inputs for current subject
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: ""
  });
  
  const [message, setMessage] = useState("");
  const [examId, setExamId] = useState(null);

  // Add a new subject to the configuration
  const handleAddSubject = () => {
    const trimmedSubject = newSubject.trim();
    if (!trimmedSubject) {
      setMessage("Please enter a subject name.");
      return;
    }
    if (examConfig.subjects[trimmedSubject]) {
      setMessage("Subject already exists.");
      return;
    }
    setExamConfig(prev => ({
      ...prev,
      subjects: { ...prev.subjects, [trimmedSubject]: [] }
    }));
    setMessage(`Subject "${trimmedSubject}" added.`);
    setNewSubject("");
    setCurrentSubject(trimmedSubject);
  };

  // Change the current subject for adding questions
  const handleSetCurrentSubject = subject => {
    setCurrentSubject(subject);
    setMessage("");
    setCurrentQuestion({
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: ""
    });
  };

  // Handle changes for question text and options
  const handleQuestionChange = e => {
    setCurrentQuestion({ ...currentQuestion, questionText: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleCorrectAnswerChange = e => {
    setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value });
  };

  // Add the current question to the current subject
  const handleAddQuestion = () => {
    if (!currentSubject) {
      setMessage("Please select a subject first.");
      return;
    }
    if (!currentQuestion.questionText.trim()) {
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
    setMessage(`Question added to ${currentSubject}.`);
    // Reset question inputs
    setCurrentQuestion({
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: ""
    });
  };

  // Save the current subject configuration to the database
  const handleSaveSubject = async () => {
    if (!currentSubject) {
      setMessage("No subject selected to save.");
      return;
    }
    const subjectQuestions = examConfig.subjects[currentSubject];
    if (!subjectQuestions || subjectQuestions.length === 0) {
      setMessage("Please add at least one question before saving this subject.");
      return;
    }
    try {
      const subjectConfig = {
        adminId: "your_admin_id_here", // Replace with actual admin ID from logged-in data
        subject: currentSubject,
        questions: subjectQuestions,
        timer: examConfig.timer
      };
      const savedSubject = await saveSubjectConfig(subjectConfig);
      setMessage(`Subject "${currentSubject}" saved successfully.`);
      // Optionally mark the subject as saved (or remove it from unsaved list)
    } catch (error) {
      console.error("Error saving subject:", error);
      setMessage("Failed to save subject configuration.");
    }
  };

  // Review the entire exam: ensure at least one subject has been saved, then generate a unique exam ID.
  const handleReviewExam = async () => {
    const hasAnySubject = Object.keys(examConfig.subjects).some(
      subject => examConfig.subjects[subject].length > 0
    );
    if (!hasAnySubject) {
      setMessage("Please save at least one subject before reviewing the exam.");
      return;
    }
    try {
      // Generate a unique exam ID (or call an API to save the complete exam config)
      const uniqueExamId = "EXAM-" + Math.floor(Math.random() * 1000000) + "-" + Date.now();
      // Here, you might update the exam configuration in the database.
      // For demonstration, we simply set the examId locally.
      setExamId(uniqueExamId);
      setMessage(`Exam configuration complete. Share this Exam ID with users: ${uniqueExamId}`);
    } catch (error) {
      console.error("Error reviewing exam:", error);
      setMessage("Error finalizing exam configuration.");
    }
  };

  // Logout for admin.
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Admin Panel - Create Exam Configuration</h2>
      
      {/* Timer Setting */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Exam Timer (seconds):{" "}
          <input
            type="number"
            value={examConfig.timer}
            onChange={(e) => setExamConfig(prev => ({ ...prev, timer: Number(e.target.value) }))}
          />
        </label>
      </div>
      <hr />
      
      {/* Subject Addition Section */}
      <div>
        <h3>Add Subjects</h3>
        <p>Enter a subject name and click "Add Subject". You can add as many subjects as you want.</p>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Enter subject name"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
          />
          <button type="button" onClick={handleAddSubject}>Add Subject</button>
        </div>
        {subjectsAdded.length > 0 && (
          <div className="subject-list">
            {subjectsAdded.map(subject => (
              <button
                key={subject}
                onClick={() => handleSetCurrentSubject(subject)}
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
        )}
      </div>
      <hr />
      
      {/* Add Questions Section */}
      {currentSubject && (
        <div style={{ textAlign: "left" }}>
          <h3>Add a Question to {currentSubject}</h3>
          <input
            type="text"
            placeholder="Question text"
            value={currentQuestion.questionText}
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
          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="button" onClick={handleAddQuestion}>Next Question</button>
            <button type="button" onClick={handleSaveSubject}>Save Subject</button>
          </div>
        </div>
      )}
      <hr />
      
      {/* Review Exam Section */}
      <div>
        <button onClick={handleReviewExam}>Review Exam & Generate Exam ID</button>
        {examId && (
          <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
            Exam ID: {examId}
          </div>
        )}
      </div>
      
      {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
      <hr />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminPanel;
