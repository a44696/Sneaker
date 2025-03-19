import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      navigate("/signin"); // Sau khi reset xong, chuyển về trang đăng nhập
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700">Reset Password</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">New Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">Confirm Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-200"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
