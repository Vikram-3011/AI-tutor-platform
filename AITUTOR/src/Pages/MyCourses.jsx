import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { API_BASE_URL } from "../config";

// Initialize Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("unfinished"); // default filter
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/mycourses/${user.email}`);
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();

        const fetchedCourses = Array.isArray(data)
          ? data[0]?.courses || []
          : data.courses || [];

        setCourses(fetchedCourses);
      } catch (err) {
        console.error("Error fetching MyCourses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c) =>
    filter === "unfinished" ? c.status !== "finished" : c.status === "finished"
  );

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Fetching your courses...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🎓 My Learning Courses</h1>

      {/* Filter Buttons */}
      <div style={styles.filterContainer}>
        <button
          onClick={() => setFilter("unfinished")}
          style={{
            ...styles.filterButton,
            background:
              filter === "unfinished"
                ? "linear-gradient(135deg,#2563eb,#3b82f6)"
                : "rgba(255,255,255,0.1)",
            color: filter === "unfinished" ? "#fff" : "#cbd5e1",
          }}
        >
          Unfinished
        </button>
        <button
          onClick={() => setFilter("finished")}
          style={{
            ...styles.filterButton,
            background:
              filter === "finished"
                ? "linear-gradient(135deg,#22c55e,#15803d)"
                : "rgba(255,255,255,0.1)",
            color: filter === "finished" ? "#fff" : "#cbd5e1",
          }}
        >
          Finished
        </button>
      </div>

      <div style={styles.card}>
        {filteredCourses.length === 0 ? (
          <p style={styles.noCourses}>
            {filter === "unfinished"
              ? "No unfinished courses found 🎯"
              : "No finished courses yet 🎉"}
          </p>
        ) : (
          <div style={styles.courseGrid}>
            {filteredCourses.map((course, idx) => (
              <div
                key={idx}
                style={styles.courseCard}
                onClick={() => navigate(`/subject/${course.subjectName}`)}
              >
                <div style={styles.courseHeader}>
                  <h3 style={styles.courseTitle}>{course.subjectName}</h3>
                  <span
                    style={{
                      ...styles.statusBadge,
                      background:
                        course.status === "finished"
                          ? "linear-gradient(135deg,#22c55e,#15803d)"
                          : "linear-gradient(135deg,#facc15,#eab308)",
                    }}
                  >
                    {course.status}
                  </span>
                </div>
                <p style={styles.courseDesc}>
                  {course.status === "finished"
                    ? "✅ You’ve completed this course!"
                    : "Continue your learning journey →"}
                </p>
                <button style={styles.viewBtn}>Open Course</button>
              </div>
            ))}
          </div>
        )}
        <button
        style={styles.quizBtn}
        onClick={() => navigate(`/performance/${subject.name}`)}
      >
        📈 View Performance
      </button>

      </div>
    </div>
  );
}

/* ---- Styling ---- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at 20% 20%, #0f172a, #020617 70%)",
    fontFamily: "'Poppins', sans-serif",
    padding: "50px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: "20px",
    textAlign: "center",
    textShadow: "0 2px 12px rgba(0,0,0,0.6)",
  },
  filterContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },
  filterButton: {
    border: "none",
    padding: "10px 25px",
    borderRadius: "30px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  },
  card: {
    width: "100%",
    maxWidth: "1100px",
    background: "rgba(255,255,255,0.05)",
    padding: "40px",
    borderRadius: "20px",
    backdropFilter: "blur(25px)",
    boxShadow: "0 15px 45px rgba(0,0,0,0.7)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
  },
  courseCard: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "25px 20px",
    cursor: "pointer",
    color: "#fff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.2s ease",
  },
  courseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  courseTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    margin: 0,
    color: "#fef9f3",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "0.8rem",
    color: "#fff",
    textTransform: "capitalize",
  },
  courseDesc: {
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.8)",
    margin: "10px 0 20px",
  },
  viewBtn: {
    alignSelf: "flex-start",
    padding: "10px 20px",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  noCourses: {
    color: "#fff",
    textAlign: "center",
    fontSize: "1.1rem",
    opacity: 0.9,
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "radial-gradient(circle at 30% 40%, #0c111b, #1b2430 80%)",
  },
  spinner: {
    width: "55px",
    height: "55px",
    border: "5px solid rgba(255,255,255,0.2)",
    borderTop: "5px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "15px",
    fontSize: "1.1rem",
    color: "#fef9f3",
  },
};

const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;
document.head.appendChild(styleSheet);

export default MyCourses;
