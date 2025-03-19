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
      const response = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      // Lưu token vào localStorage
      localStorage.setItem("token", data.token);
  
      // Lưu thông tin user vào localStorage (giả sử API trả về name và avatar)
      const userInfo = { name: data.name, avatar: data.avatar || "/default-avatar.png" };
      localStorage.setItem("user", JSON.stringify(userInfo));
  
      // Điều hướng tới trang chính
      navigate("/");
      window.location.reload(); // Tải lại trang để cập nhật Header
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700">Sign Up</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account? <a href="#" onClick={() => navigate("/signin")} className="text-purple-600 hover:underline">Sign In</a>
        </p>
        <p className="text-sm text-center text-gray-600 mt-2">
          Forgot your password? <a href="#" onClick={handleForgotPassword} className="text-purple-600 hover:underline">Reset it</a>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
