import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/user/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      const userInfo = { name: data.name, avatar: data.avatar || "/default-avatar.png" };
      localStorage.setItem("user", JSON.stringify(userInfo));
      navigate("/");
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96">
        <div className="flex justify-center mb-4 space-x-4">
          <h2 className="text-2xl font-bold text-gray-900 cursor-pointer">Login</h2>
          <h2
            className="text-2xl font-semibold text-gray-400 cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Register
          </h2>
        </div>
        <p className="text-center text-sm text-gray-600 mb-4">
          If you have an account, sign in with your username or email address.
        </p>
        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="bg-white">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username or email address *</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input type="checkbox" className="border-gray-300" />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-blue-600 hover:underline"
            >
              Lost your password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-200"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
