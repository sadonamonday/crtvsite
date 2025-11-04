import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("user_email", email);
      formData.append("user_password", password);

      const res = await fetch(
        "https://crtvshotss.atwebpages.com/auth/signup.php",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success) {
        setMessage(
          "Account created. Please check your email to verify your account."
        );
      } else {
        setError(data.message || "Failed to sign up.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 text-gray-900 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center mb-2">Create account</h1>
        <p className="text-center text-gray-600 mb-6">Join CRTV Shots</p>

        {message && (
          <div className="mb-4 text-center text-green-700 bg-green-100 p-2 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 text-center text-red-700 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#06d6a0] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#06d6a0] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#06d6a0] focus:outline-none"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#06d6a0] focus:outline-none"
              required
              minLength={8}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#06d6a0] text-black p-3 rounded font-semibold hover:bg-[#05b88c] transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;


