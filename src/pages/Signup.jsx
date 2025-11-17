import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/Logo.png";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    user_firstname: "",
    user_surname: "",
    user_username: "",
    user_email: "",
    user_password: "",
    conf_user_password: "",
    user_address: "",
    user_contact: "",
  });

  const [errors, setErrors] = useState({
    user_firstname: "",
    user_surname: "",
    user_username: "",
    user_email: "",
    user_password: "",
    conf_user_password: "",
    user_contact: "",
    general: "",
  });

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", general: "" });
  };

  const isPositive = (msg) => msg.startsWith("✓");

  // -------------------------------
  // USERNAME VALIDATION
  // -------------------------------
  useEffect(() => {
    if (!form.user_username) return setErrors((prev) => ({ ...prev, user_username: "" }));

    if (form.user_username.length < 4) {
      setErrors((prev) => ({ ...prev, user_username: "At least 4 characters" }));
      return;
    }

    fetch(`https://crtvshotss.atwebpages.com/check_username.php?username=${encodeURIComponent(form.user_username)}`)
      .then((res) => res.json())
      .then((data) => {
        setErrors((prev) => ({
          ...prev,
          user_username: data.available
            ? "✓ Username available"
            : `Username taken. Try: ${data.suggestions.join(", ")}`,
        }));
      });
  }, [form.user_username]);

  // -------------------------------
  // EMAIL VALIDATION
  // -------------------------------
  useEffect(() => {
    if (!form.user_email) return setErrors((prev) => ({ ...prev, user_email: "" }));

    const gmailPattern = /^[\w.%+-]+@gmail\.com$/;
    if (!gmailPattern.test(form.user_email)) {
      setErrors((prev) => ({ ...prev, user_email: "Enter a valid Gmail address." }));
      return;
    }

    fetch(`https://crtvshotss.atwebpages.com/check_email.php?email=${encodeURIComponent(form.user_email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.available) setErrors((prev) => ({ ...prev, user_email: "Email already exists." }));
      });
  }, [form.user_email]);

  // -------------------------------
  // PASSWORD VALIDATION
  // -------------------------------
  useEffect(() => {
    if (!form.user_password) return setErrors((prev) => ({ ...prev, user_password: "" }));

    const val = form.user_password;
    const rules = [];
    if (val.length < 8) rules.push("at least 8 characters");
    if (!/[A-Z]/.test(val)) rules.push("1 uppercase letter");
    if (!/[0-9]/.test(val)) rules.push("1 number");
    if (!/[\W]/.test(val)) rules.push("1 special character");

    setErrors((prev) => ({
      ...prev,
      user_password: rules.length === 0 ? "✓ Password is strong" : `Password must include: ${rules.join(", ")}`,
    }));
  }, [form.user_password]);

  // -------------------------------
  // CONFIRM PASSWORD VALIDATION
  // -------------------------------
  useEffect(() => {
    if (!form.conf_user_password) return setErrors((prev) => ({ ...prev, conf_user_password: "" }));

    setErrors((prev) => ({
      ...prev,
      conf_user_password:
        form.conf_user_password === form.user_password
          ? "✓ Passwords match"
          : "Passwords do not match.",
    }));
  }, [form.conf_user_password, form.user_password]);

  // -------------------------------
  // CONTACT NUMBER VALIDATION
  // -------------------------------
  useEffect(() => {
    if (!form.user_contact) return setErrors((prev) => ({ ...prev, user_contact: "" }));

    const valid = /^(\+27|0)[0-9]{9}$/.test(form.user_contact);
    setErrors((prev) => ({
      ...prev,
      user_contact: valid ? "" : "Invalid SA phone number.",
    }));
  }, [form.user_contact]);

  // -------------------------------
  // HANDLE SUBMIT
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear general errors
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      formData.append("users", 1);

      const res = await fetch("https://crtvshotss.atwebpages.com/signup.php", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();

      if (text.includes("Signup successful")) {
        alert("Signup successful! Please check your email to verify your account.");
        navigate("/login");
      } else {
        // Show server errors in general field
        setErrors((prev) => ({ ...prev, general: text }));
      }
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({ ...prev, general: "An unexpected error occurred. Please try again later." }));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 relative">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <Link to="/">
          <img src={logo} alt="CRTVisuals logo" className="w-24 h-auto" />
        </Link>
      </div>

      {/* Spacer */}
      <div className="h-24"></div>

      {/* Form Container */}
      <main className="flex-grow flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Create Account</h1>

          {/* General Error Box */}
          {errors.general && (
            <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* First Name */}
            <div>
              <input
                name="user_firstname"
                placeholder="First Name"
                className="p-3 border w-full rounded"
                value={form.user_firstname}
                onChange={updateField}
                required
              />
              {errors.user_firstname && <small className="text-red-600">{errors.user_firstname}</small>}
            </div>

            {/* Surname */}
            <div>
              <input
                name="user_surname"
                placeholder="Surname"
                className="p-3 border w-full rounded"
                value={form.user_surname}
                onChange={updateField}
                required
              />
              {errors.user_surname && <small className="text-red-600">{errors.user_surname}</small>}
            </div>

            {/* Username */}
            <div>
              <input
                name="user_username"
                placeholder="Username"
                className="p-3 border w-full rounded"
                value={form.user_username}
                onChange={updateField}
                required
              />
              {errors.user_username && (
                <small className={isPositive(errors.user_username) ? "text-green-600" : "text-red-600"}>
                  {errors.user_username}
                </small>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                name="user_email"
                type="email"
                placeholder="Email (Gmail only)"
                className="p-3 border w-full rounded"
                value={form.user_email}
                onChange={updateField}
                required
              />
              {errors.user_email && <small className="text-red-600">{errors.user_email}</small>}

              {!/^[\w.%+-]+@gmail\.com$/.test(form.user_email) && form.user_email && (
                <p className="text-sm mt-1 text-gray-500">
                  Don’t have a Gmail?{" "}
                  <a
                    href="https://accounts.google.com/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Create one here
                  </a>
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                name="user_password"
                type="password"
                placeholder="Password"
                className="p-3 border w-full rounded"
                value={form.user_password}
                onChange={updateField}
                required
              />
              {errors.user_password && (
                <small className={isPositive(errors.user_password) ? "text-green-600" : "text-red-600"}>
                  {errors.user_password}
                </small>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                name="conf_user_password"
                type="password"
                placeholder="Confirm Password"
                className="p-3 border w-full rounded"
                value={form.conf_user_password}
                onChange={updateField}
                required
              />
              {errors.conf_user_password && (
                <small className={isPositive(errors.conf_user_password) ? "text-green-600" : "text-red-600"}>
                  {errors.conf_user_password}
                </small>
              )}
            </div>

            {/* Address */}
            <input
              name="user_address"
              placeholder="Address"
              className="p-3 border w-full rounded"
              value={form.user_address}
              onChange={updateField}
              required
            />

            {/* Contact */}
            <div>
              <input
                name="user_contact"
                placeholder="Contact Number"
                className="p-3 border w-full rounded"
                value={form.user_contact}
                onChange={updateField}
                required
              />
              {errors.user_contact && <small className="text-red-600">{errors.user_contact}</small>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#06d6a0] text-black p-3 rounded font-semibold hover:bg-[#05b88c] transition"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
