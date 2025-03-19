import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignInPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:8080/api/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Register failed");

      localStorage.setItem("token", data.token);
      navigate("/");
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-[400px]">
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => { setIsRegister(false); navigate("/auth"); }}
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

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                checked={role === "customer"}
                onChange={() => setRole("customer")}
              />
              <span>I am a customer</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                checked={role === "vendor"}
                onChange={() => setRole("vendor")}
              />
              <span>I am a vendor</span>
            </div>
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
