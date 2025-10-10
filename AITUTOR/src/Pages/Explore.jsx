import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Explore() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/subjects`)
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching subjects:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading amazing subjects...</p>
      </div>
    );

  return (
    <div style={styles.page}>
      {/* Header Section */}
      <header style={styles.header}>
        <h1 style={styles.title}>Explore Knowledge</h1>
        <p style={styles.subtitle}>
          Discover exciting subjects and dive deep into learning.
        </p>
      </header>

      {/* Subjects Grid */}
      <div style={styles.grid}>
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <div
              key={subject._id}
              onClick={() =>
                navigate(`/subject/${encodeURIComponent(subject.name)}`)
              }
              style={styles.card}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-10px) scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0) scale(1)")
              }
            >
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{subject.name}</h3>
                <p style={styles.cardDesc}>
                  Start your journey into {subject.name}. Learn the basics,
                  understand the core concepts, and grow your skills.
                </p>
                <button style={styles.learnBtn}>Start Learning →</button>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.noSubjects}>No subjects found yet.</p>
        )}
      </div>
    </div>
  );
}

/* --- STYLES --- */
const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f232cff, #203a43, #2c5364)", // dark glass background
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
    padding: "60px 20px",
    textAlign: "center",
  },
  header: {
    marginBottom: "50px",
    animation: "fadeInDown 1s ease",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "10px",
    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#d0d0d0",
  },
  grid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "30px",
  maxWidth: "1200px", // increased max width
  margin: "0 auto",
},

  card: {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    padding: "30px",
    textAlign: "left",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "10px",
  },
  cardDesc: {
    color: "#ddd",
    fontSize: "0.95rem",
    lineHeight: "1.5",
    marginBottom: "20px",
  },
  learnBtn: {
    alignSelf: "flex-start",
    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
    border: "none",
    borderRadius: "30px",
    padding: "10px 20px",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  noSubjects: {
    gridColumn: "1 / -1",
    color: "#bbb",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background:
      "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  },
  spinner: {
    width: "45px",
    height: "45px",
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
  
};

// animations
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeInDown {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(styleSheet);

export default Explore;
