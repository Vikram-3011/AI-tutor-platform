import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
// Assuming you have this file exporting the initialized Supabase client
import { supabase } from "../supabaseClient"; 

function Explore() {
  const [subjects, setSubjects] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false); // Loading state for API fetch
  const [loadingAuth, setLoadingAuth] = useState(true); // New state for initial auth check
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      // 1. CRITICAL: Check Authentication Status
      

      
      // Authentication passed, set initial states and start data fetching
      setLoadingAuth(false);
      setLoadingContent(true); 

      // 2. Fetch Subjects (Only if authenticated)
      try {
        const res = await fetch(`${API_BASE_URL}/api/subjects`);
        const data = await res.json();
        setSubjects(data);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      } finally {
        setLoadingContent(false);
      }
    };

    checkAuthAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  if (loadingAuth || loadingContent)
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>
          {loadingAuth ? "Verifying access..." : "Loading subjects..."}
        </p>
      </div>
    );

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Explore Subjects</h1>
        <p style={styles.subtitle}>
          Dive into curated learning experiences crafted for excellence.
        </p>
      </header>

      <div style={styles.grid}>
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <div
              key={subject._id}
              style={styles.card}
              onClick={() =>
                navigate(`/subject/${encodeURIComponent(subject.name)}`)
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-8px) scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0) scale(1)")
              }
            >
              <div style={styles.cardHeader}>
                {subject.icon && (
                  <img src={subject.icon} alt={subject.name} style={styles.icon} />
                )}
                <h3 style={styles.cardTitle}>{subject.name}</h3>
              </div>
              <p style={styles.cardDesc}>
                Unlock the essentials of {subject.name}. Build a foundation and grow deeper with each topic.
              </p>
              <button style={styles.learnBtn}>Start Learning →</button>
            </div>
          ))
        ) : (
          <p style={styles.noSubjects}>No subjects found yet.</p>
        )}
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
    padding: "60px 30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    textAlign: "center",
    marginBottom: "50px",
  },
  title: {
    fontSize: "2.8rem",
    fontWeight: "700",
    background: "linear-gradient(90deg, #2563eb, #60a5fa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: "1.1rem",
    marginTop: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    width: "100%",
    maxWidth: "1200px",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
    padding: "25px 20px",
    textAlign: "left",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
  },
  icon: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    objectFit: "cover",
    boxShadow: "0 0 15px rgba(255,255,255,0.1)",
  },
  cardTitle: {
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#93c5fd",
  },
  cardDesc: {
    color: "#e2e8f0",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    marginBottom: "20px",
  },
  learnBtn: {
    alignSelf: "flex-start",
    padding: "10px 22px",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(90deg, #2563eb, #3b82f6)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  noSubjects: {
    gridColumn: "1 / -1",
    textAlign: "center",
    color: "#aaa",
  },
  loadingPage: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "radial-gradient(circle at 20% 20%, #0f172a, #020617 70%)",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255,255,255,0.2)",
    borderTop: "5px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "15px",
  },
  loadingText: {
    color: "#fff",
    fontSize: "1.1rem",
    marginTop: "10px",
  },
};

// Animations
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;
document.head.appendChild(styleSheet);

export default Explore;