import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const dummyUser = { email: "user@example.com", password: "user123" };

    if (email === dummyUser.email && password === dummyUser.password) {
      localStorage.setItem("user", JSON.stringify({ email }));
      navigate("/home");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Quiz App</title>
      </Helmet>
      <div className="bg-gray-900 h-screen flex items-center justify-center">
        <div className="bg-gray-800 w-1/3 border border-gray-600 rounded-lg p-8">
          <h1 className="text-white text-center text-4xl font-extrabold mb-4">
            Login
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="text-white block mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-gray-600 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="text-white block mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-gray-600 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
