import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function SubjectDetail() {
  const { name } = useParams();
  const [subject, setSubject] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/subjects/${name}`)
      .then((res) => res.json())
      .then((data) => {
        setSubject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching subject:", err);
        setLoading(false);
      });
  }, [name]);

  if (loading)
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Preparing your learning journey...</p>
      </div>
    );

  if (!subject)
    return (
      <div style={styles.page}>
        <p style={{ textAlign: "center", color: "#fff" }}>
          Subject not found.
        </p>
      </div>
    );

  const handleNext = () => {
    if (currentTopic < subject.topics.length) setCurrentTopic(currentTopic + 1);
  };

  const handlePrev = () => {
    if (currentTopic > 0) setCurrentTopic(currentTopic - 1);
  };

  const progress =
    (currentTopic / subject.topics.length) * 100 > 100
      ? 100
      : (currentTopic / subject.topics.length) * 100;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>{subject.name}</h1>
          <p style={styles.subtitle}>Your interactive learning guide</p>
        </header>

        {/* Progress Bar */}
        <div style={styles.progressBarContainer}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
        </div>

        {/* Content Section */}
        <div style={styles.contentBox}>
          {currentTopic === 0 ? (
            <div style={styles.topicBox}>
              <h2 style={styles.topicTitle}>📘 Introduction</h2>
              <p style={styles.text}>
                <strong>Overview:</strong> {subject.introduction.overview}
              </p>
              <p style={styles.text}>
                <strong>Why Learn:</strong> {subject.introduction.why_learn}
              </p>
              <p style={styles.text}>
                <strong>Purpose:</strong> {subject.introduction.purpose}
              </p>
            </div>
          ) : (
            <div style={styles.topicBox}>
              <h2 style={styles.topicTitle}>
                {subject.topics[currentTopic - 1].title}
              </h2>
             <p style={styles.text}>
                {subject.topics[currentTopic - 1].content}
              </p>

              {/* Display code block if available */}
                          {subject.topics[currentTopic - 1].examples &&
                subject.topics[currentTopic - 1].examples.map((ex, idx) => (
                  <div key={idx} style={{ marginBottom: "20px" }}>
                    <p style={styles.text}><strong>Example {idx + 1}:</strong> {ex.description}</p>
                    <div style={styles.codeBox}>
                      <pre style={styles.pre}>
                        <code>{ex.code}</code>
                      </pre>
                    </div>
                  </div>
              ))}


            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {/* Navigation Buttons */}
<div style={styles.navButtons}>
  {/* Previous / Back buttons */}
  {currentTopic > 0 ? (
    <button onClick={handlePrev} style={styles.prevBtn}>
      ← Previous
    </button>
  ) : (
    <button onClick={() => navigate("/explore")} style={styles.backBtn}>
      ⬅ Back to Explore
    </button>
  )}

  {/* Next Topic / Completion */}
  {currentTopic < subject.topics.length ? (
    <button onClick={handleNext} style={styles.nextBtn}>
      Next →
    </button>
  ) : (
    <div style={styles.completeSection}>
      <p style={styles.completeText}>🎉 You’ve completed this subject!</p>
      <button
        onClick={() => navigate("/explore")}
        style={styles.nextSubjectBtn}
      >
        Next Subject →
      </button>
    </div>
  )}
</div>

      </div>
    </div>
  );
}

/* --- STYLES --- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },
  container: {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    maxWidth: "800px",
    width: "100%",
    padding: "40px",
    animation: "fadeIn 1s ease",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#d0d0d0",
    fontSize: "1rem",
  },
  progressBarContainer: {
    width: "100%",
    height: "8px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "30px",
  },
  progressBar: {
    height: "8px",
    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
    borderRadius: "10px",
    transition: "width 0.5s ease",
  },
  contentBox: {
    textAlign: "left",
    color: "#f2f2f2",
    lineHeight: "1.7",
    minHeight: "250px",
  },
  topicBox: {
    animation: "slideIn 0.6s ease",
  },
  topicTitle: {
    fontSize: "1.6rem",
    color: "#00c6ff",
    marginBottom: "15px",
  },
  text: {
    marginBottom: "12px",
    fontSize: "1rem",
    color: "#e0e0e0",
  },
  navButtons: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "40px",
  },
  prevBtn: {
    padding: "10px 25px",
    borderRadius: "30px",
    border: "none",
    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  backBtn: {
    padding: "10px 25px",
    borderRadius: "30px",
    border: "none",
    background: "linear-gradient(90deg, #171fbbff, #2575fc)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  nextBtn: {
    padding: "10px 25px",
    borderRadius: "30px",
    border: "none",
    background: "linear-gradient(90deg, #2ecc71, #27ae60)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  completeText: {
    color: "#2ecc71",
    fontWeight: "600",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255,255,255,0.2)",
    borderTop: "5px solid #00c6ff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "15px",
    color: "#fff",
    fontSize: "1.1rem",
  },
  codeBox: {
  backgroundColor: "#1e1e1e",
  color: "#00ffae",
  padding: "15px",
  borderRadius: "10px",
  marginTop: "15px",
  fontFamily: "Consolas, 'Courier New', monospace",
  overflowX: "auto",
  boxShadow: "inset 0 0 10px rgba(0, 255, 174, 0.2)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
},
pre: {
  margin: 0,
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
},

};

// Animations
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(styleSheet);

export default SubjectDetail;
