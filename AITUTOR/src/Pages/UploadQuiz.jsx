import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

function UploadQuiz() {
  const { subjectName, topicTitle } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("MCQ");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  // Add question handler
  const addQuestion = () => {
    if (!question || !answer) {
      setMessage("⚠️ Please fill question and correct answer.");
      return;
    }
    if (type === "MCQ" && options.some((opt) => !opt)) {
      setMessage("⚠️ Please fill all 4 options for MCQ.");
      return;
    }

    const newQ = { question, type, options: type === "MCQ" ? options : [], answer };
    setQuestions([...questions, newQ]);
    setQuestion("");
    setOptions(["", "", "", ""]);
    setAnswer("");
    setMessage("✅ Question added!");
  };

  // Save quiz handler
  const saveQuiz = async () => {
    if (questions.length === 0) {
      setMessage("⚠️ Add at least one question before saving.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectName, topicTitle, questions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage("✅ Quiz saved successfully!");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Quiz</h2>
        <h3 style={styles.subtitle}>
          {subjectName} → {topicTitle}
        </h3>

        {message && (
          <p
            style={{
              ...styles.message,
              color: message.includes("✅")
                ? "#22c55e"
                : message.includes("⚠️")
                ? "#facc15"
                : "#ef4444",
            }}
          >
            {message}
          </p>
        )}

        {/* Question Input */}
        <input
          style={styles.input}
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {/* Question Type */}
        <select
          style={styles.select}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="MCQ">Multiple Choice (MCQ)</option>
          <option value="TF">True / False</option>
        </select>

        {/* Options for MCQ */}
        {type === "MCQ" && (
          <>
            {options.map((opt, i) => (
              <input
                key={i}
                style={styles.input}
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) =>
                  setOptions(
                    options.map((o, idx) => (idx === i ? e.target.value : o))
                  )
                }
              />
            ))}
          </>
        )}

        {/* Correct Answer */}
        <input
          style={styles.input}
          placeholder="Enter correct answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button style={styles.btnAdd} onClick={addQuestion}>
            ➕ Add Question
          </button>
          <button style={styles.btnSave} onClick={saveQuiz}>
            💾 Save Quiz
          </button>
        </div>

        {/* Questions Preview */}
        <div style={styles.previewSection}>
          <h4 style={styles.previewTitle}>
            Added Questions ({questions.length})
          </h4>
          {questions.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No questions added yet.</p>
          ) : (
            <ul style={styles.questionList}>
              {questions.map((q, i) => (
                <li key={i} style={styles.questionItem}>
                  <strong>{i + 1}.</strong> {q.question}{" "}
                  <span style={styles.typeTag}>{q.type}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================
   💅 Inline Styles (CSS in JS)
================================ */
const styles = {
  page: {
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    background: "#1e293b",
    color: "#f8fafc",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    width: "100%",
    maxWidth: "600px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "5px",
    color: "#22d3ee",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "25px",
    textAlign: "center",
    color: "#94a3b8",
  },
  message: {
    textAlign: "center",
    marginBottom: "20px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: "15px",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: "15px",
    outline: "none",
  },
  btnRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    flexWrap: "wrap",
    gap: "10px",
  },
  btnAdd: {
    flex: 1,
    padding: "12px",
    background: "#38bdf8",
    color: "#0f172a",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
  },
  btnSave: {
    flex: 1,
    padding: "12px",
    background: "#22c55e",
    color: "#0f172a",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
  },
  previewSection: {
    marginTop: "30px",
    borderTop: "1px solid #334155",
    paddingTop: "20px",
  },
  previewTitle: {
    marginBottom: "10px",
    color: "#22d3ee",
    fontWeight: "600",
  },
  questionList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  questionItem: {
    background: "#0f172a",
    marginBottom: "10px",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeTag: {
    background: "#22d3ee",
    color: "#0f172a",
    borderRadius: "8px",
    padding: "2px 8px",
    fontSize: "12px",
    fontWeight: "600",
  },
};

export default UploadQuiz;
