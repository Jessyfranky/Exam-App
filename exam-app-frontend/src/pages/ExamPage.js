import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import examQuestions from "../data/questions.js"; // Ensure each subject's questions are loaded
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

  // Track current question index for the current subject.
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Track answers: structure: { subject: { questionId: selectedOption, ... }, ... }
  const [answers, setAnswers] = useState({});

  // Global Timer (in seconds) for the entire exam.
  const initialTimer = 10 * 60; // Example: 10 minutes total for the entire exam.
  const [timeLeft, setTimeLeft] = useState(initialTimer);

  // Note: We no longer reset the timer on subject change.
  // We do reset the current question index when the subject changes.
  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, [currentSubject]);

  // Global Timer countdown effect.
  useEffect(() => {
    if (timeLeft <= 0) {
      // When timer runs out, auto-submit the exam.
      handleSubmitExam();
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

  // Navigate to a specific question via the grid.
  const handleGoToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Previous and Next buttons.
  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => (prev < questions.length - 1 ? prev + 1 : prev));
  };

  // Allow switching subjects.
  const handleSubjectChange = (index) => {
    setCurrentSubjectIndex(index);
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Check if a question is answered.
  const isAnswered = (subject, questionId) => {
    return answers[subject] && answers[subject][questionId];
  };

  // Get user's answer for the current question.
  const userAnswer =
    answers[currentSubject] ? answers[currentSubject][currentQuestion?.id] : null;

  // Calculate progress percentage for the current subject.
  const progressPercent =
    questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // Submit exam: store answers and navigate to dashboard.
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
                    checked={userAnswer === option}
                    onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
            {/* Feedback Message */}
            {userAnswer && (
              <p className={`feedback-message ${userAnswer === currentQuestion.correctAnswer ? "correct" : "wrong"}`}>
                {userAnswer === currentQuestion.correctAnswer
                  ? "Well done, that was correct."
                  : "Oh... Sorry that was wrong."}
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
