import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: supaUser } } = await supabase.auth.getUser();
      if (!supaUser) navigate("/signin");
      setUser(supaUser);
    };
    fetchUser();
  }, [navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setMessage("Password updated successfully!");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to update password");
    }
  };

  return (
    <div style={styles.page}>
  
      <div style={styles.card}>
        {/* Header with title and Back button */}
        <div style={styles.header}>
          <h2 style={styles.title}>Change Password</h2>
          <button style={styles.backButton} onClick={() => navigate("/profile")}>
        &larr; Back
      </button>
        </div>

        <form onSubmit={handleChangePassword} style={styles.form}>
          {/* <input
            type="password"
            placeholder="Current Password (optional)"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={styles.input}
          /> */}
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Update Password</button>
          {message && <p style={styles.message}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0c111b, #1b2430)",
    fontFamily: "'Poppins', sans-serif",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.7)",
    border: "1px solid rgba(255,255,255,0.15)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  title: {
    color: "#ffd700",
    fontSize: "1.8rem",
    fontWeight: "700",
    textShadow: "0 2px 10px rgba(0,0,0,0.6)",
    margin: 0,
  },
  backButton: {
    padding: "8px 12px",
    borderRadius: "12px",
    border: "none",
    background: "rgba(255, 215, 0, 0.2)",
    color: "#ffd700",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
  },
  form: { display: "flex", flexDirection: "column", gap: "15px", width: "100%" },
  input: {
    padding: "12px 15px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "#fef9f3",
    outline: "none",
    fontSize: "1rem",
    backdropFilter: "blur(5px)",
    transition: "all 0.3s ease",
  },
  button: {
    padding: "14px",
    borderRadius: "30px",
    border: "none",
    background: "linear-gradient(135deg, #222, #444)",
    color: "#ffd700",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
  },
  message: {
    color: "#ffd700",
    marginTop: "10px",
    textAlign: "center",
    fontWeight: "500",
  },
};

export default ChangePassword;
