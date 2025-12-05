import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const VITE_API_BASE_URL = "https://ai-tutor-khaki.vercel.app"; // backend URL
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function AttendQuiz() {
  const { subjectName, topicTitle } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState(null);

  // ✅ Get Supabase logged-in user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email);
      else setMessage("❌ Please login before attempting the quiz.");
    };
    getUser();
  }, []);

  // ✅ Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`${VITE_API_BASE_URL}/api/quiz/${subjectName}/${topicTitle}`);
        if (!res.ok) throw new Error("Quiz not found for this topic.");
        const data = await res.json();
        setQuiz(data);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [subjectName, topicTitle]);

  const handleSelect = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  // ✅ Auto-hide message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ✅ Submit quiz
  const submitQuiz = async () => {
    if (!quiz) return;
    if (!userEmail) {
      setMessage("❌ Please login before submitting the quiz.");
      return;
    }

    let correct = 0;
    const submittedAnswers = quiz.questions.map((q, i) => {
      const selected = answers[i] || "";
      if (selected.trim().toLowerCase() === q.answer.trim().toLowerCase()) correct++;
      return {
        question: q.question,
        selectedAnswer: selected,
        correctAnswer: q.answer,
      };
    });

    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          subjectName,
          topicTitle,
          score: correct,
          answers: submittedAnswers,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      setScore(correct);
      setMessage("✅ Quiz submitted successfully!");

      // ✅ Redirect after 3 seconds
      setTimeout(() => {
        navigate(`/subject/${subjectName}`);
      }, 3000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error submitting quiz: " + err.message);
    }
  };

  // Loading state
  if (loading)
    return (
      <div style={styles.page}>
        <p>Loading quiz...</p>
      </div>
    );

  // Error or no quiz found
  if (!quiz)
    return (
      <div style={styles.page}>
        <h2>{message || "No quiz found for this topic."}</h2>
      </div>
    );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>
          {subjectName} → {topicTitle}
        </h2>
        <h3>🧠 Attend Quiz</h3>

        {/* ✅ Show score box above Submit button */}
        {score !== null && (
          <div style={styles.result}>
            <h3>
              Your Score: {score} / {quiz.questions.length}
            </h3>
            <p>
              {score / quiz.questions.length >= 0.8
                ? "🌟 Excellent! You’ve mastered this topic."
                : score / quiz.questions.length >= 0.5
                ? "💡 Good effort! Review a few concepts again."
                : "⚠️ Needs improvement. Revisit the topic and try again."}
            </p>
          </div>
        )}

        {quiz.questions.map((q, i) => (
          <div key={i} style={styles.questionCard}>
            <h4>
              {i + 1}. {q.question}
            </h4>
            {q.type === "MCQ" ? (
              q.options.map((opt, j) => (
                <label key={j} style={styles.option}>
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={opt}
                    checked={answers[i] === opt}
                    onChange={(e) => handleSelect(i, e.target.value)}
                  />
                  {opt}
                </label>
              ))
            ) : (
              <>
                <label style={styles.option}>
                  <input
                    type="radio"
                    name={`q${i}`}
                    value="True"
                    checked={answers[i] === "True"}
                    onChange={(e) => handleSelect(i, e.target.value)}
                  />
                  True
                </label>
                <label style={styles.option}>
                  <input
                    type="radio"
                    name={`q${i}`}
                    value="False"
                    checked={answers[i] === "False"}
                    onChange={(e) => handleSelect(i, e.target.value)}
                  />
                  False
                </label>
              </>
            )}
          </div>
        ))}

        <button style={styles.btnPrimary} onClick={submitQuiz}>
          Submit Quiz
        </button>

        {message && (
          <p
            style={{
              marginTop: 15,
              textAlign: "center",
              fontWeight: "500",
              color: message.startsWith("✅") ? "#22c55e" : "#f87171",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// ✅ Styling
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: "700px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px",
    padding: "30px 40px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
  },
  questionCard: {
    margin: "15px 0",
    padding: "15px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.1)",
  },
  option: {
    display: "block",
    margin: "8px 0",
  },
  btnPrimary: {
    marginTop: "20px",
    padding: "10px 20px",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(90deg, #2563eb, #3b82f6)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
  result: {
    marginBottom: 20,
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "15px",
  },
};

export default AttendQuiz;
