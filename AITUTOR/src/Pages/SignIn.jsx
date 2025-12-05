import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { VITE_API_BASE_URL } from "../config";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return setMessage(error.message);

    const user = data.user;
    if (user) {
      try {
        // Ensure profile exists
        await fetch(`${VITE_API_BASE_URL}/api/create-profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });

        // Ensure user role entry exists
        await fetch(`${VITE_API_BASE_URL}/api/roles/register-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.user_metadata?.name || user.email.split("@")[0],
          }),
        });

        setMessage("Login successful!");
        setTimeout(() => navigate("/home"), 1000);
      } catch (err) {
        console.error(err);
        setMessage("Login succeeded, but setup failed.");
      }
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}> Sign In</h2>
        <form onSubmit={handleLogin} style={styles.form}>
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
          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
        <p style={styles.footer}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={styles.link}
          >
            Sign Up
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

export default SignIn;
