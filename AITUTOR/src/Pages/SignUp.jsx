import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      return setMessage("Passwords do not match.");
    }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Signup successful! Check your email.");
      setTimeout(() => navigate("/signin"), 2000);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}> Create Account</h2>
        <form onSubmit={handleSignup} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
        <p style={styles.footer}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            style={styles.link}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at 20% 20%, #0f172a, #020617 70%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
    padding: "20px",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(25px)",
    padding: "40px 30px",
    borderRadius: "25px",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 15px 45px rgba(0,0,0,0.7)",
    border: "1px solid rgba(255,255,255,0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: "25px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
  },
  button: {
    padding: "12px 20px",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(135deg,#2563eb,#3b82f6)",
    color: "#fff",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  message: {
    marginTop: "15px",
    color: "#fef9f3",
    fontSize: "0.9rem",
    textAlign: "center",
  },
  footer: {
    marginTop: "20px",
    fontSize: "0.9rem",
    color: "#cbd5e1",
  },
  link: {
    color: "#3b82f6",
    fontWeight: "600",
    cursor: "pointer",
    marginLeft: "5px",
  },
};

export default SignUp;
