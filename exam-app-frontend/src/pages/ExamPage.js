// src/pages/ExamPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchExamConfigById } from "../services/adminApi.js"; // Backend call to fetch admin exam config
import "../styles/global.css";

const ExamPage = () => {
  const navigate = useNavigate();
  const { examId } = useParams(); // e.g., /exam/EXAM-ABC123

  // Unconditional hooks at top:
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [adminExamConfig, setAdminExamConfig] = useState(null);
  const [userSubjects, setUserSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Exam navigation & answer state:
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes global timer
  const [examMessage, setExamMessage] = useState("");

  // 1. Check if a user is logged in and ensure the user is NOT an admin.
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role === "admin") {
      alert("Admins must log out and log in as a regular user to take exams.");
      navigate("/login");
      return;
    }
    setLoggedInUser(user);
  }, [navigate]);

  // 2. Check if the user has selected subjects (exactly 4); if not, redirect to Dashboard.
  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem("selectedSubjects"));
    if (!storedSubjects || storedSubjects.length !== 4) {
      navigate("/dashboard");
    } else {
      setUserSubjects(storedSubjects);
    }
  }, [navigate]);

  // 3. Fetch the admin exam configuration using examId.
  useEffect(() => {
    if (examId) {
      fetchExamConfigById(examId)
        .then((config) => {
          setAdminExamConfig(config);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching exam config:", error);
          setLoading(false);
        });
    }
  }, [examId]);

  // 4. Global timer countdown effect.
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  // 5. Format time as MM:SS.
  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // 6. Derived variables—calculate filtered subjects, current subject object, and questions.
  let filteredSubjects = [];
  let currentSubjectObj = null;
  let currentSubjectQuestions = [];
  let currentQuestion = null;
  if (adminExamConfig && userSubjects.length === 4) {
    // Assume adminExamConfig.subjects is an array of objects { name, questions }
    filteredSubjects = adminExamConfig.subjects.filter((sub) =>
      userSubjects.includes(sub.name)
    );
    currentSubjectObj = filteredSubjects[currentSubjectIndex];
    currentSubjectQuestions = currentSubjectObj ? currentSubjectObj.questions : [];
    currentQuestion = currentSubjectQuestions[currentQuestionIndex];
  }

  // 7. Helper: check if a question is answered.
  const isAnswered = (subjectName, questionId) => {
    return answers[subjectName] && answers[subjectName][questionId];
  };

  // 8. Handle answer selection.
  const handleAnswerSelect = (questionId, option) => {
    if (!currentSubjectObj) return;
    setAnswers((prev) => ({
      ...prev,
      [currentSubjectObj.name]: {
        ...prev[currentSubjectObj.name],
        [questionId]: option,
      },
    }));
  };

  // 9. Grid navigation: jump to specific question.
  const handleGoToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // 10. Previous and Next navigation.
  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) =>
      prev < currentSubjectQuestions.length - 1 ? prev + 1 : prev
    );
  };

  // 11. Subject navigation.
  const handleSubjectChange = (index) => {
    setCurrentSubjectIndex(index);
    setCurrentQuestionIndex(0);
  };

  // 12. Calculate progress percentage.
  const progressPercent =
    currentSubjectQuestions.length > 0
      ? ((currentQuestionIndex + 1) / currentSubjectQuestions.length) * 100
      : 0;

  // 13. Get user's answer for the current question.
  const userAnswer =
    currentSubjectObj && currentQuestion
      ? answers[currentSubjectObj.name]
        ? answers[currentSubjectObj.name][currentQuestion.id]
        : null
      : null;

  // 14. Submit exam: store answers and navigate to dashboard.
  const handleSubmitExam = () => {
    localStorage.setItem("examAnswers", JSON.stringify(answers));
    navigate("/dashboard");
  };

  if (loading) {
    return <div className="container"><p>Loading exam...</p></div>;
  }
  if (!adminExamConfig) {
    return <div className="container"><p>Error loading exam configuration.</p></div>;
  }

  return (
    <div className="container exam-container">
      {/* Timer and Subject Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>{currentSubjectObj ? currentSubjectObj.name : ""} Exam</h2>
        <div className="timer" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Subject Navigation */}
      <div className="subject-nav" style={{ marginBottom: "1rem" }}>
        {filteredSubjects.map((sub, idx) => (
          <button
            key={sub.name}
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
            {sub.name}
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
          Question {currentQuestionIndex + 1} of {currentSubjectQuestions.length}
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
        <button onClick={handleNext} disabled={currentQuestionIndex === currentSubjectQuestions.length - 1}>
          Next
        </button>
      </div>

      {/* Grid Navigation */}
      <div className="grid-navigation" style={{ marginTop: "1rem" }}>
        <h4>Jump to Question:</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: "0.5rem" }}>
          {currentSubjectQuestions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="grid-box"
              onClick={() => handleGoToQuestion(idx)}
              style={{
                padding: "0.5rem",
                border: "1px solid #ccc",
                textAlign: "center",
                cursor: "pointer",
                position: "relative",
                background: isAnswered(currentSubjectObj.name, q.id) ? "#e0ffe0" : "#fff",
              }}
            >
              {idx + 1}
              {isAnswered(currentSubjectObj.name, q.id) && (
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
      {examMessage && (
        <p style={{ marginTop: "1rem", whiteSpace: "pre-wrap", color: "green" }}>
          {examMessage}
        </p>
      )}
    </div>
  );
};

export default ExamPage;
