import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <h1>Welcome to Exam App</h1>
      <p>Test your knowledge and track your progress with our unique exam experience.</p>
      <button onClick={() => navigate("/login")}>Login</button>
   
    </div>
  );
};

export default HomePage;
