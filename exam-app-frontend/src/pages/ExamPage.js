import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import examQuestions from "../data/questions.js"; // Assume each subject has 40 questions
import "../styles/global.css";

const ExamPage = () => {
  const navigate = useNavigate();

  // Retrieve selected subjects from localStorage; assume it's an array of subject names.
  const storedSubjects = JSON.parse(localStorage.getItem("selectedSubjects")) || [];
  const [subjects, setSubjects] = useState(storedSubjects);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const currentSubject = subjects[currentSubjectIndex];

  // Each subject will have 40 questions; we assume examQuestions[currentSubject] returns an array of 40 question objects.
  const questions = examQuestions[currentSubject] || [];

  // Track current question index for each subject separately.
  // We'll use an object where key is subject name and value is the current question index.
  const [currentQuestionIndexMap, setCurrentQuestionIndexMap] = useState(
    () => {
      const initial = {};
      subjects.forEach(sub => {
        initial[sub] = 0;
      });
      return initial;
    }
  );

  // Track answers: structure: { subject: { questionId: selectedOption, ... }, ... }
  const [answers, setAnswers] = useState({});

  // Handle answer selection for the current question.
  const handleAnswerSelect = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [currentSubject]: {
        ...prev[currentSubject],
        [questionId]: option,
      },
    }));
  };

  // Navigate to a specific question number via grid.
  const handleGoToQuestion = (index) => {
    setCurrentQuestionIndexMap(prev => ({ ...prev, [currentSubject]: index }));
  };

  // Go to previous question.
  const handlePrevious = () => {
    setCurrentQuestionIndexMap(prev => {
      const newIndex = prev[currentSubject] > 0 ? prev[currentSubject] - 1 : 0;
      return { ...prev, [currentSubject]: newIndex };
    });
  };

  // Go to next question.
  const handleNext = () => {
    setCurrentQuestionIndexMap(prev => {
      const newIndex = prev[currentSubject] < questions.length - 1 ? prev[currentSubject] + 1 : prev[currentSubject];
      return { ...prev, [currentSubject]: newIndex };
    });
  };

  // Change current subject (allow switching subjects even if not fully answered).
  const handleSubjectChange = (index) => {
    setCurrentSubjectIndex(index);
  };

  // Get the current question based on currentSubject and its index.
  const currentQuestionIndex = currentQuestionIndexMap[currentSubject] || 0;
  const currentQuestion = questions[currentQuestionIndex];

  // Function to check if a question is answered.
  const isAnswered = (subject, questionId) => {
    return answers[subject] && answers[subject][questionId];
  };

  // Optional: handle exam submission (save answers, score exam, etc.)
  const handleSubmitExam = () => {
    localStorage.setItem("examAnswers", JSON.stringify(answers));
    // Navigate to dashboard or results page.
    navigate("/dashboard");
  };

  return (
    <div className="container exam-container">
      {/* Subject Navigation */}
      <div className="subject-nav">
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

      <hr />

      {/* Current Question Display */}
      <div className="question-section">
  <h3>
    {currentSubject} - Question {currentQuestionIndex + 1} of {questions.length}
  </h3>
  {currentQuestion ? (
    <div>
      <p>{currentQuestion.question}</p>
      <div className="options">
        {currentQuestion.options.map((option) => (
          <label key={option} className="option">
            <input
              type="radio"
              name={`question-${currentQuestion.id}`}
              value={option}
              checked={
                answers[currentSubject] &&
                answers[currentSubject][currentQuestion.id] === option
              }
              onChange={() => handleAnswerSelect(currentQuestion.id, option)}
            />
            {option}
          </label>
        ))}
      </div>
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
