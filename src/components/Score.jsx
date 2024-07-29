import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Score = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { correctAnswers, incorrectAnswers, score } = location.state || {};

  if (
    correctAnswers === undefined ||
    incorrectAnswers === undefined ||
    score === undefined
  ) {
    navigate("/");
    return null;
  }

  const handleRestart = () => {
    sessionStorage.removeItem("questions");
    localStorage.removeItem("selectedAnswers");
    navigate("/quiz"); // Replace with the route to restart the quiz
  };

  return (
    <>
      <Helmet>
        <title>Score - Quiz App</title>
      </Helmet>
      <div className="bg-gray-900 text-white flex flex-col min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-3xl p-4 bg-gray-800 border border-gray-600 rounded-lg text-center">
          <h1 className="text-4xl font-semibold mb-4">Your Score</h1>
          <p className="text-xl mb-2">Correct Answers: {correctAnswers}</p>
          <p className="text-xl mb-2">Incorrect Answers: {incorrectAnswers}</p>
          <p className="text-2xl font-bold mb-4">Score: {score.toFixed(2)}%</p>
          <button
            className="bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded text-white font-semibold"
            onClick={handleRestart}
          >
            Restart Quiz
          </button>
        </div>
      </div>
    </>
  );
};

export default Score;
