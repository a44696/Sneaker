import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const SignInPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault(); // Ngăn trang bị reload khi submit
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post('http://localhost:8080/api/user/register', {
        name: username,
        email,
        password,
      });

      setMessage("Registration successful! Please check your email to verify your account.");
      console.log("Registration successful!", response.data);
    } catch (err: any) {
      console.error("Registration failed", err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-[400px]">
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => { setIsRegister(false); navigate("/login"); }}
            className={`text-lg font-semibold ${!isRegister ? "text-black" : "text-gray-400"}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`text-lg font-semibold ${isRegister ? "text-black" : "text-gray-400"}`}
          >
            Register
          </button>
        </div>

        <p className="text-center text-sm mb-4 text-gray-700">
          There are many advantages to creating an account: the payment process is faster, shipment tracking is possible and much more.
        </p>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
        {message && <p className="text-green-500 text-sm text-center mb-2">{message}</p>} {/* Thêm thông báo thành công */}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username *</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email address *</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password *</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <p className="text-xs text-gray-600">
            Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <span className="text-purple-600 underline cursor-pointer">privacy policy</span>.
          </p>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
