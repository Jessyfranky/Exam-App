import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import examQuestions from "../data/questions.js"; // Ensure each subject has 40 questions
import "../styles/global.css";

const ExamPage = () => {
  const navigate = useNavigate();
  
  // Retrieve selected subjects from localStorage; assume it's an array of subject names.
  const storedSubjects = JSON.parse(localStorage.getItem("selectedSubjects")) || [];
  const [subjects, setSubjects] = useState(storedSubjects);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const currentSubject = subjects[currentSubjectIndex];

  // Retrieve questions for the current subject.
  const questions = examQuestions[currentSubject] || [];

  // Track current question index.
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Track answers: { subject: { questionId: selectedOption, ... }, ... }
  const [answers, setAnswers] = useState({});

  // Timer (in seconds); for example, 10 minutes per subject.
  const initialTimer = 10 * 60; // 10 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(initialTimer);

  // Reset timer and current question index whenever subject changes.
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setTimeLeft(initialTimer);
  }, [currentSubject, initialTimer]);

  // Timer countdown effect.
  useEffect(() => {
    if (timeLeft <= 0) {
      // Optionally, auto-submit or move to next subject.
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Format time as MM:SS.
  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle answer selection for the current question.
  const handleAnswerSelect = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentSubject]: {
        ...prev[currentSubject],
        [questionId]: option,
      },
    }));
  };

  // Navigate to a specific question via grid.
  const handleGoToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Previous button.
  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // Next button.
  const handleNext = () => {
    setCurrentQuestionIndex((prev) => (prev < questions.length - 1 ? prev + 1 : prev));
  };

  // Subject navigation: allow switching subjects.
  const handleSubjectChange = (index) => {
    setCurrentSubjectIndex(index);
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Check if a question is answered.
  const isAnswered = (subject, questionId) => {
    return answers[subject] && answers[subject][questionId];
  };

  // Calculate progress percentage.
  const progressPercent = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // Submit exam.
  const handleSubmitExam = () => {
    localStorage.setItem("examAnswers", JSON.stringify(answers));
    navigate("/dashboard");
  };

  return (
    <div className="container exam-container">
      {/* Timer and Subject Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>{currentSubject} Exam</h2>
        <div className="timer" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="subject-nav" style={{ marginBottom: "1rem" }}>
        {subjects.map((sub, idx) => (
          <button
            key={sub}
            onClick={() => handleSubjectChange(idx)}
            style={{
              background: idx === currentSubjectIndex ? "var(--accent-dark)" : "var(--accent-color)",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              margin: "0.25rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div style={{ width: "100%", background: "#ddd", borderRadius: "5px", height: "10px", marginBottom: "1rem" }}>
        <div
          style={{
            width: `${progressPercent}%`,
            background: "var(--accent-color)",
            height: "100%",
            borderRadius: "5px",
            transition: "width 0.5s",
          }}
        />
      </div>

      {/* Current Question Display */}
      <div className="question-section">
        <h3>
          Question {currentQuestionIndex + 1} of {questions.length}
        </h3>
        {currentQuestion ? (
          <div>
            <p>{currentQuestion.question}</p>
            <div className="options">
              {currentQuestion.options.map((option) => (
                <label key={currentQuestion.id + option} className="option">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={isAnswered(currentSubject, currentQuestion.id) === option}
                    onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
            {/* After answering, show the correct answer */}
            {isAnswered(currentSubject, currentQuestion.id) && (
              <p style={{ color: "green", marginTop: "0.5rem" }}>
                Correct Answer: {currentQuestion.correctAnswer}
              </p>
            )}
          </div>
        ) : (
          <p>No question available.</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons" style={{ marginTop: "1rem" }}>
        <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Previous
        </button>
        <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
          Next
        </button>
      </div>

      {/* Grid Navigation */}
      <div className="grid-navigation" style={{ marginTop: "1rem" }}>
        <h4>Jump to Question:</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: "0.5rem" }}>
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="grid-box"
              onClick={() => handleGoToQuestion(idx)}
              style={{
                padding: "0.5rem",
                border: "1px solid #ccc",
                textAlign: "center",
                cursor: "pointer",
                position: "relative",
                background: isAnswered(currentSubject, q.id) ? "#e0ffe0" : "#fff",
              }}
            >
              {idx + 1}
              {isAnswered(currentSubject, q.id) && (
                <span className="tick">&#10004;</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr />

      {/* Submit Exam Button */}
      <button onClick={handleSubmitExam} style={{ marginTop: "1rem" }}>
        Submit Exam
      </button>
    </div>
  );
};

export default ExamPage;
