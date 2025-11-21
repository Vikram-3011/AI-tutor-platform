import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart registration
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top", labels: { color: "#fff" } },
    title: { display: true, text: "Topic Score Breakdown", color: "#60a5fa" },
  },
  scales: {
    x: {
      ticks: { color: "#fff" },
      grid: { color: "rgba(255,255,255,0.1)" },
    },
    y: {
      ticks: { color: "#fff" },
      grid: { color: "rgba(255,255,255,0.1)" },
      min: 0,
      max: 100,
    },
  },
};

function PerformancePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [finishedSubjects, setFinishedSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [performanceData, setPerformanceData] = useState([]);
  const [analysis, setAnalysis] = useState({ avgScore: 0, feedback: "" });

  // --- Authentication ---
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        navigate("/signin");
        return;
      }
      setUserEmail(data.user.email);
    };
    loadUser();
  }, [navigate]);

  // --- Fetch Finished Subjects ---
  useEffect(() => {
    if (!userEmail) return;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/mycourses/${userEmail}`);
        const { courses } = await res.json();

        const done = courses.filter((c) => c.status === "finished");
        setFinishedSubjects(done.map((c) => c.subjectName));

        if (done.length > 0) setSelectedSubject(done[0].subjectName);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userEmail]);

  // --- Fetch Performance Data ---
  useEffect(() => {
    if (!userEmail || !selectedSubject) return;

    const loadPerformance = async () => {
      setLoading(true);

      try {
        const emailEncoded = encodeURIComponent(userEmail);
        const subjectEncoded = encodeURIComponent(selectedSubject);
        const res = await fetch(
          `${API_BASE_URL}/api/user/performance/${emailEncoded}/${subjectEncoded}`
        );
        const { results } = await res.json();

        setPerformanceData(results);
        analyze(results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadPerformance();
  }, [userEmail, selectedSubject]);

  // --- Analysis Logic (unchanged) ---
  const analyze = (data) => {
    if (!data.length) {
      setAnalysis({
        avgScore: 0,
        feedback: "No quiz attempts for this subject.",
      });
      return;
    }

    const total = data.reduce((s, x) => s + x.score, 0);
    const avg = Math.round(total / data.length);

    let feedback = "";
    if (avg >= 80) feedback = "Excellent! Keep it up.";
    else if (avg >= 60)
      feedback = "Good work! Review low-score topics to improve.";
    else feedback = "Needs improvement — revise the weak areas.";

    const low = data.filter((i) => i.score < 60);
    if (low.length > 0) {
      feedback += `\n\nLow Score Topics: ${low
        .map((x) => x.topicTitle)
        .join(", ")}`;
    }

    setAnalysis({ avgScore: avg, feedback });
  };

  const chartData = {
    labels: performanceData.map((d) => d.topicTitle),
    datasets: [
      {
        label: "Score (%)",
        data: performanceData.map((d) => d.score),
        backgroundColor: performanceData.map((d) =>
          d.score < 60 ? "rgba(255,99,132,0.7)" : "rgba(96,165,250,0.7)"
        ),
      },
    ],
  };

  // --- Loading Page ---
  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading performance...</p>
      </div>
    );
  }

  // --- No Finished Subjects ---
  if (finishedSubjects.length === 0) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>Your Performance</h1>
        <p style={styles.noSubjects}>
          You haven't completed any courses yet.
        </p>
      </div>
    );
  }

  // ================================
  //    MAIN UI (Explore-like UI)
  // ================================
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Performance Overview</h1>
        <p style={styles.subtitle}>
          Analyze your learning progress with visual insights.
        </p>
      </header>

      {/* Subject Selector */}
      <div style={styles.selectorBox}>
        <label style={styles.selectorLabel}>Choose Subject:</label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={styles.select}
        >
          {finishedSubjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Explore-Style Card */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>{selectedSubject} Performance</h2>

        <p style={styles.avgScore}>
          Average Score:{" "}
          <span
            style={{
              color: analysis.avgScore < 60 ? "#ff6b81" : "#60a5fa",
            }}
          >
            {analysis.avgScore}%
          </span>
        </p>

        <p style={styles.feedback}>{analysis.feedback}</p>

        <div style={styles.chartContainer}>
          {performanceData.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <p style={styles.noChartData}>No quiz data for this subject.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ===============================
//      EXPLORE STYLE UI
// ===============================
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
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.7rem",
    fontWeight: "700",
    background: "linear-gradient(90deg, #2563eb, #60a5fa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#cbd5e1",
  },

  /* Selector */
  selectorBox: {
    background: "rgba(255,255,255,0.05)",
    padding: "15px 20px",
    borderRadius: "15px",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(15px)",
    marginBottom: "25px",
    display: "flex",
    gap: "15px",
    alignItems: "center",
    width: "100%",
    maxWidth: "800px",
  },
  selectorLabel: {
    fontWeight: "600",
    color: "#93c5fd",
  },
  select: {
    flex: 1,
    padding: "10px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    border: "none",
    color: "#3274deff",
    outline: "none",
  },

  /* Card */
  card: {
    width: "100%",
    maxWidth: "900px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "30px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
  },
  cardTitle: {
    fontSize: "1.8rem",
    color: "#93c5fd",
    marginBottom: "15px",
  },
  avgScore: {
    fontSize: "1.3rem",
    fontWeight: "600",
    marginBottom: "15px",
  },
  feedback: {
    whiteSpace: "pre-line",
    lineHeight: "1.5",
    marginBottom: "20px",
  },

  chartContainer: {
    height: "350px",
    width: "100%",
    background: "rgba(0,0,0,0.3)",
    borderRadius: "15px",
    padding: "15px",
  },

  noChartData: {
    textAlign: "center",
    padding: "80px",
    opacity: 0.6,
  },

  /* Loading Page */
  loadingPage: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at 20% 20%, #0f172a, #020617 70%)",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255,255,255,0.2)",
    borderTop: "5px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "#fff",
    marginTop: "15px",
  },

  noSubjects: {
    marginTop: "40px",
    color: "#cbd5e1",
  },
};

// Spinner Animation
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes spin {
  from { transform: rotate(0); }
  to   { transform: rotate(360deg); }
}`;
document.head.appendChild(styleSheet);

export default PerformancePage;
