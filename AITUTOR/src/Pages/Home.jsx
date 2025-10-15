import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { API_BASE_URL } from "../config";

// Initialize Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function Home() {
  const [exploreSubjects, setExploreSubjects] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loadingExplore, setLoadingExplore] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const navigate = useNavigate();

  // Fetch Explore Subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/subjects`);
        const data = await res.json();
        const shuffled = data.sort(() => 0.5 - Math.random());
        setExploreSubjects(shuffled.slice(0, 3));
      } catch (err) {
        console.error("Error fetching subjects:", err);
      } finally {
        setLoadingExplore(false);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch My Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const res = await fetch(`${API_BASE_URL}/api/mycourses/${user.email}`);
        const data = await res.json();
        const courses = Array.isArray(data) ? data[0]?.courses || [] : data.courses || [];
        setMyCourses(courses.filter((c) => c.status !== "finished").slice(0, 3));
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Welcome Back to AI Tutor</h1>
      <p style={styles.subtitle}>Continue your learning journey and explore new subjects </p>

      {/* Explore Subjects */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}> Explore Subjects</h2>
        {loadingExplore ? (
          <p style={styles.loadingText}>Loading subjects...</p>
        ) : (
          <div style={styles.grid}>
            {exploreSubjects.map((subject, idx) => (
              <div
                key={idx}
                style={styles.card}
                onClick={() => navigate(`/subject/${encodeURIComponent(subject.name)}`)}
              >
                <h3 style={styles.cardTitle}>{subject.name}</h3>
                <p style={styles.cardDesc}>Unlock the essentials of {subject.name}.</p>
                <button style={styles.viewBtn}>View Subject →</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Courses */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}> My Courses</h2>
        {loadingCourses ? (
          <p style={styles.loadingText}>Loading your courses...</p>
        ) : myCourses.length === 0 ? (
          <p style={styles.noCourses}>No ongoing courses. Explore and start learning!</p>
        ) : (
          <div style={styles.grid}>
            {myCourses.map((course, idx) => (
              <div
                key={idx}
                style={styles.card}
                onClick={() => navigate(`/subject/${course.subjectName}`)}
              >
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{course.subjectName}</h3>
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
                <p style={styles.cardDesc}>
                  {course.status === "finished"
                    ? "✅ You’ve completed this course!"
                    : "Continue your learning journey →"}
                </p>
                <button style={styles.viewBtn}>Open Course</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* --- STYLES --- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at 20% 20%, #0f172a, #020617 70%)",
    fontFamily: "'Poppins', sans-serif",
    padding: "50px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "rgba(255,255,255,0.7)",
    marginBottom: "40px",
    textAlign: "center",
  },
  section: {
    width: "100%",
    maxWidth: "1100px",
    marginBottom: "60px",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom: "25px",
    borderLeft: "5px solid #ffd700",
    paddingLeft: "12px",
    color: "#fef9f3",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px",
    padding: "25px",
    backdropFilter: "blur(15px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "all 0.3s ease",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    margin: 0,
    color: "#fef9f3",
  },
  cardDesc: {
    fontSize: "0.95rem",
    color: "rgba(255,255,255,0.8)",
    marginBottom: "15px",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "0.8rem",
    color: "#fff",
    textTransform: "capitalize",
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
    fontSize: "1rem",
    opacity: 0.8,
  },
  loadingText: {
    fontSize: "1rem",
    opacity: 0.8,
  },
};

export default Home;
