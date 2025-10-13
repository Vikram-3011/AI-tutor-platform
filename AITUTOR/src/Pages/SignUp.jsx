import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Auth.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

 const handleSignup = async (e) => {
  e.preventDefault();
  setMessage("");

  if (password !== confirmPassword) return setMessage("Passwords do not match.");

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) setMessage(error.message);
  else {
    setMessage("Signup successful! Check your email.");
    setTimeout(() => navigate("/signin"), 2000);
  }
};


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <form onSubmit={handleSignup} className="auth-form">
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        {message && <p className="auth-message">{message}</p>}
        <p className="auth-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/signin")} className="auth-link">
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
