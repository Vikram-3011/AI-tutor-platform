import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError("");

    const formData = new FormData();
    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY);
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("message", form.message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });

         setTimeout(() => {
    setSubmitted(false);
  }, 3000);
      } else {
        setError(data.message || "Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Contact Us</h1>
        <p style={styles.subtitle}>We’re here to help! Reach out anytime.</p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <textarea
            placeholder="Your Message"
            name="message"
            value={form.message}
            onChange={handleChange}
            style={styles.textarea}
            required
          ></textarea>

          <button style={styles.button} type="submit">
            Send Message →
          </button>
        </form>

        {submitted && (
          <div style={styles.successBox}>Message sent successfully!</div>
        )}

        {error && <div style={styles.errorBox}>{error}</div>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at 20% 20%, #0f172a, #020617 70%)",
    fontFamily: "'Poppins', sans-serif",
    color: "#fff",
    padding: "60px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "100%",
    maxWidth: "600px",
    background: "rgba(255,255,255,0.05)",
    padding: "40px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
  },

  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    textAlign: "center",
    background: "linear-gradient(90deg, #2563eb, #60a5fa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    textAlign: "center",
    color: "#cbd5e1",
    marginTop: "10px",
    marginBottom: "30px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  input: {
    padding: "14px 18px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "16px",
    outline: "none",
  },

  textarea: {
    padding: "14px 18px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    height: "150px",
    fontSize: "16px",
    outline: "none",
  },

  button: {
    padding: "14px 22px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "600",
    background: "linear-gradient(90deg, #2563eb, #3b82f6)",
    color: "white",
    transition: "0.3s",
  },

  successBox: {
    marginTop: "25px",
    padding: "14px",
    background: "rgba(0, 200, 0, 0.15)",
    borderRadius: "10px",
    textAlign: "center",
    color: "lightgreen",
    fontWeight: "600",
  },

  errorBox: {
    marginTop: "25px",
    padding: "14px",
    background: "rgba(255, 0, 0, 0.18)",
    borderRadius: "10px",
    textAlign: "center",
    color: "#ff6b6b",
    fontWeight: "600",
  },
};
