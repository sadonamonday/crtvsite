import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/Logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("user_email", email);
    formData.append("user_password", password);

    try {
      const res = await fetch(
        "https://crtvshotss.atwebpages.com/sessions/login_simple.php",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      // Check if response is JSON
      const text = await res.text();
      console.log("Server response:", text);
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse JSON. Server returned:", text.substring(0, 500));
        setError("Server error: The login endpoint is not responding correctly. Please make sure the session files are uploaded to the server.");
        return;
      }

      console.log("Login Response:", data);

      if (data.success) {
        sessionStorage.setItem("user_email", email);
        navigate("/Verify2FA");
      } else if (data.email_verified === false) {
        setError(data.message || "Please verify your email first.");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Network error. Please check your connection and try again.");
    }
  };

  const handleResendVerification = async () => {
    try {
      const formData = new FormData();
      formData.append("user_email", email);
      const res = await fetch(
        "https://crtvshotss.atwebpages.com/resend_verification.php",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert("Failed to send verification email. Try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 relative">
      <div className="absolute top-6 left-6">
        <Link to="/" aria-label="Back to home">
          <img
            src={logo}
            alt="CRTVisuals logo"
            className="w-24 h-auto object-contain"
          />
        </Link>
      </div>
      {/* Main Login Form */}
      <main className="flex-grow flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
            Login
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-center text-red-600 bg-red-100 p-2 rounded">
              {error}
              {error.toLowerCase().includes("verify your email") && (
                <button
                  type="button"
                  className="ml-2 underline text-blue-600"
                  onClick={handleResendVerification}
                >
                  Resend Verification Email
                </button>
              )}
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-[#06d6a0] text-black p-3 rounded font-semibold hover:bg-[#05b88c] transition"
            >
              Login
            </button>
          </form>

          {/* Signup / Forgot Password */}
          <div className="mt-6 text-center text-sm">
            <p>
              Don't have an account?{" "}
              <Link
      to="/signup"
      className="text-blue-600 hover:underline font-medium"
    >
      Sign up
    </Link>
            </p>
            <p className="mt-2">
              <a
                href="https://crtvshotss.atwebpages.com/forgot_password.php"
                className="text-blue-600 hover:underline font-medium"
              >
                Forgot Password?
              </a>
            </p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Login;
