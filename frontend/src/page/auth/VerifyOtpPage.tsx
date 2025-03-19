import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyOtpPage: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/user/verify-forgot-password-otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      setSuccess(true);
      navigate("/reset-password"); // Chuyển đến trang reset password
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700">Verify OTP</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">Enter OTP</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-200"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
