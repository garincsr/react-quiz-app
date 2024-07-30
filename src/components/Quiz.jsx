import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faGamepad } from "@fortawesome/free-solid-svg-icons";

const Quiz = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState(
    JSON.parse(localStorage.getItem("selectedAnswers")) || {}
  );
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const storedQuestions = sessionStorage.getItem("questions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
      setLoading(false);
    } else {
      axios
        .get(
          "https://opentdb.com/api.php?amount=5&category=15&difficulty=easy&type=multiple"
        )
        .then((response) => {
          const fetchedQuestions = response.data.results.map((q) => ({
            ...q,
            options: [...q.incorrect_answers, q.correct_answer],
          }));
          setQuestions(fetchedQuestions);
          sessionStorage.setItem("questions", JSON.stringify(fetchedQuestions));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
          setLoading(false);
        });
    }
  }, [user, navigate]);

  useEffect(() => {
    setCurrentAnswer(selectedAnswers[currentQuestionIndex] || "");
  }, [currentQuestionIndex, selectedAnswers]);

  useEffect(() => {
    if (timeLeft === 0) {
      calculateScore();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleQuit = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("questions");
    navigate("/");
  };

  const handleNextQuestion = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };

  const handlePreviousQuestion = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const saveCurrentAnswer = () => {
    const updatedAnswers = {
      ...selectedAnswers,
      [currentQuestionIndex]: currentAnswer,
    };
    setSelectedAnswers(updatedAnswers);
    localStorage.setItem("selectedAnswers", JSON.stringify(updatedAnswers));
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correctAnswers++;
      } else {
        incorrectAnswers++;
      }
    });

    const score = (correctAnswers / questions.length) * 100;

    navigate("/score", {
      state: {
        correctAnswers,
        incorrectAnswers,
        score,
      },
    });
  };

  const currentQuestion = questions[currentQuestionIndex];

  function removeCharacters(question) {
    return question
      .replace(/(&quot;)/g, '"')
      .replace(/(&rsquo;)/g, '"')
      .replace(/(&#039;)/g, "'")
      .replace(/(&amp;)/g, "&");
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gray-900 text-white flex flex-col min-h-screen items-center justify-center p-4">
        <h1 className="text-[10rem] font-bold">Loading...</h1>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <>
      <Helmet>
        <title>Play - Quiz App</title>
      </Helmet>
      <div className="bg-gray-900 text-white flex flex-col min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-3xl p-4 bg-gray-800 border border-gray-600 rounded-lg">
          <div className="flex justify-between">
            <p className="m-0 text-green-400 flex items-center gap-x-1">
              <FontAwesomeIcon className="text-white" icon={faGamepad} />
              Category
            </p>
            <h5 className="md:w-24 text-right">
              {currentQuestionIndex + 1} of {questions.length}
            </h5>
          </div>
          <div className="flex justify-between mt-2">
            <p className="m-0 text-green-400 flex items-center gap-x-1">
              Video Games
            </p>
            <h5 className="md:w-24 flex items-center justify-end">
              <FontAwesomeIcon className="mr-1" icon={faClock} />
              <h5 className="text-green-400">{formatTime(timeLeft)}</h5>
            </h5>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-5 mb-4">
            <h1 className="text-4xl font-semibold leading-relaxed">
              {removeCharacters(currentQuestion.question)}
            </h1>
          </div>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`w-full text-left py-2 px-3 rounded hover:bg-blue-500 ${
                  currentAnswer === option ? "bg-blue-500" : "bg-gray-700"
                }`}
                onClick={() => setCurrentAnswer(option)}
              >
                {removeCharacters(option)}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-x-2 mt-10 font-semibold">
            <button
              className="bg-blue-600 hover:bg-blue-500 w-[8rem] py-3 rounded"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              {"<<"} Previous
            </button>
            <button
              className="bg-green-600 hover:bg-green-500 w-[8rem] py-3 rounded"
              onClick={handleNextQuestion}
            >
              Next {">>"}
            </button>
            <button
              className="bg-red-600 hover:bg-red-500 w-[8rem] py-3 rounded"
              onClick={handleQuit}
            >
              Quit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Quiz;
