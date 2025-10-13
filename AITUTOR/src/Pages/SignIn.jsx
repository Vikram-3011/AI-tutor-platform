import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { API_BASE_URL } from "../config";
import "./Auth.css";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
const handleLogin = async (e) => {
  e.preventDefault();
  setMessage("");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return setMessage(error.message);

  const user = data.user;
  if (user) {
    try {
      // Ensure profile exists
      await fetch(`${API_BASE_URL}/api/create-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      setMessage("Login successful!");
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Login succeeded, but profile check failed.");
    }
  }
};


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign In</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>
        {message && <p className="auth-message">{message}</p>}
        <p className="auth-footer">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} className="auth-link">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
