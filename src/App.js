import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// components
import Login from "./components/Login";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Score from "./components/Score";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/score" element={<Score />} />
      </Routes>
    </Router>
  );
}

export default App;
