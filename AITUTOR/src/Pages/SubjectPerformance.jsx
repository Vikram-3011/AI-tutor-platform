import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Static data for subjects
const SUBJECT_DATA = {
  Java: {
    performance: [
      { topicTitle: "Variables & Data Types", score: 80 },
      { topicTitle: "Control Statements", score: 70 },
      { topicTitle: "OOP Concepts", score: 45 },
      { topicTitle: "Collections Framework", score: 60 },
      { topicTitle: "Exception Handling", score: 50 },
    ],
  },
  Python: {
    performance: [
      { topicTitle: "Variables & Data Types", score: 85 },
      { topicTitle: "Loops & Conditions", score: 75 },
      { topicTitle: "Functions", score: 90 },
      { topicTitle: "OOP Concepts", score: 60 },
    ],
  },
  // Add more subjects as needed
};

function SubjectPerformance() {
  const { subjectName } = useParams();
  const navigate = useNavigate();

  const [performance, setPerformance] = useState([]);
  const [summary, setSummary] = useState({ avg: 0, weakTopics: [] });

  useEffect(() => {
    // Load static data for the subject
    const subjectData = SUBJECT_DATA[subjectName];
    if (!subjectData) {
      navigate("/mycourses"); // Redirect if no data
      return;
    }

    const results = subjectData.performance;
    setPerformance(results);

    // Calculate summary
    const total = results.reduce((sum, r) => sum + r.score, 0);
    const avg = (total / results.length).toFixed(1);
    const weakTopics = results.filter((r) => r.score < 50).map((r) => r.topicTitle);
    setSummary({ avg, weakTopics });
  }, [subjectName, navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}> {subjectName} - Performance Report</h1>

        {performance.length === 0 ? (
          <p style={styles.noData}>No performance data found for this subject.</p>
        ) : (
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Score (%)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {performance.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.topicTitle}</td>
                    <td>{item.score}</td>
                    <td
                      style={{
                        color: item.score >= 50 ? "#22c55e" : "#ef4444",
                        fontWeight: 600,
                      }}
                    >
                      {item.score >= 50 ? "Passed" : "Needs Improvement"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={styles.summary}>
              <h2>Summary</h2>
              <p> <strong>Average Score:</strong> {summary.avg}%</p>
              {summary.weakTopics.length > 0 ? (
                <p> <strong>Weak Topics:</strong> {summary.weakTopics.join(", ")}</p>
              ) : (
                <p> All topics look strong! Great job!</p>
              )}
            </div>
          </>
        )}

        <button style={styles.backBtn} onClick={() => navigate("/mycourses")}>
          ⬅ Back to My Courses
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "30px",
    width: "90%",
    maxWidth: "900px",
    color: "#e2e8f0",
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
  },
  title: { textAlign: "center", fontSize: "1.8rem", color: "#60a5fa", marginBottom: "20px" },
  table: { width: "100%", borderCollapse: "collapse", marginBottom: "25px" },
  noData: { textAlign: "center", color: "#f87171" },
  summary: { background: "rgba(255,255,255,0.05)", padding: "15px 20px", borderRadius: "12px", marginTop: "15px" },
  backBtn: { background: "linear-gradient(90deg, #2563eb, #3b82f6)", color: "#fff", border: "none", borderRadius: "25px", padding: "10px 20px", cursor: "pointer", fontWeight: "600", display: "block", margin: "20px auto 0" },
};

export default SubjectPerformance;
