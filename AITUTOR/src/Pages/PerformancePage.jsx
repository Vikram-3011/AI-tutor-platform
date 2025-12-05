import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { VITE_API_BASE_URL } from "../config";
import { useNavigate, useLocation } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart registration
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function PerformancePage() {
  const navigate = useNavigate();
  const location = useLocation(); // To catch data from SubjectDetail
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  
  const [finishedSubjects, setFinishedSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("ALL"); // Default to ALL
  
  // Data for Single Subject View
  const [topicData, setTopicData] = useState([]);
  
  // Data for All Subjects View
  const [allSubjectsData, setAllSubjectsData] = useState([]);
  const [globalAverage, setGlobalAverage] = useState(0);

  const [analysis, setAnalysis] = useState({ avgScore: 0, feedback: "" });

  // --- 1. Authentication ---
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

  // --- 2. Fetch Finished Subjects & Handle Redirect ---
  useEffect(() => {
    if (!userEmail) return;
    const loadSubjects = async () => {
      try {
        const res = await fetch(`${VITE_API_BASE_URL}/api/mycourses/${userEmail}`);
        const { courses } = await res.json();

        const done = courses.filter((c) => c.status === "finished");
        const doneNames = done.map((c) => c.subjectName);
        setFinishedSubjects(doneNames);

        // Check if we came from SubjectDetail (finish course)
        if (location.state?.subjectName && doneNames.includes(location.state.subjectName)) {
            setSelectedSubject(location.state.subjectName);
        } else if (done.length > 0 && selectedSubject !== "ALL") {
           // Keep current selection
        } else {
           setSelectedSubject("ALL");
        }

      } catch (e) {
        console.error(e);
      } finally {
        // If we are in "ALL" mode, we need to trigger the all-fetch next
        if (selectedSubject !== "ALL") setLoading(false);
      }
    };
    loadSubjects();
  }, [userEmail]);

  // --- 3. Master Fetcher (Decides what to load) ---
  useEffect(() => {
    if (!userEmail || finishedSubjects.length === 0) {
        setLoading(false);
        return;
    }

    if (selectedSubject === "ALL") {
        fetchOverallPerformance();
    } else {
        fetchSingleSubjectPerformance();
    }
  }, [selectedSubject, userEmail, finishedSubjects]);


  // --- Logic A: Fetch ALL Subjects Data (Aggregate) ---
  const fetchOverallPerformance = async () => {
    setLoading(true);
    try {
        const emailEncoded = encodeURIComponent(userEmail);
        
        // Parallel Fetch for all subjects
        const promises = finishedSubjects.map(async (sub) => {
            const res = await fetch(`${VITE_API_BASE_URL}/api/user/performance/${emailEncoded}/${encodeURIComponent(sub)}`);
            const data = await res.json();
            
            // Calculate average for this specific subject
            const results = data.results || [];
            const total = results.reduce((sum, r) => sum + r.score, 0);
            const avg = results.length ? Math.round(total / results.length) : 0;
            
            return { subject: sub, average: avg };
        });

        const results = await Promise.all(promises);
        setAllSubjectsData(results);

        // Calculate Global Average
        const globalTotal = results.reduce((sum, r) => sum + r.average, 0);
        const globalAvg = results.length ? Math.round(globalTotal / results.length) : 0;
        setGlobalAverage(globalAvg);

        // Global Feedback
        let feedback = "";
        if (globalAvg >= 80) feedback = "Outstanding! You are mastering all your subjects.";
        else if (globalAvg >= 60) feedback = "Good job! You are consistent, but try to aim higher in weaker subjects.";
        else feedback = "Keep pushing! Try to revisit subjects with lower scores.";
        
        setAnalysis({ avgScore: globalAvg, feedback });

    } catch (err) {
        console.error("Error fetching overall:", err);
    } finally {
        setLoading(false);
    }
  };

  // --- Logic B: Fetch SINGLE Subject Data ---
  const fetchSingleSubjectPerformance = async () => {
    setLoading(true);
    try {
      const emailEncoded = encodeURIComponent(userEmail);
      const subjectEncoded = encodeURIComponent(selectedSubject);
      const res = await fetch(
        `${API_BASE_URL}/api/user/performance/${emailEncoded}/${subjectEncoded}`
      );
      const { results } = await res.json();

      setTopicData(results);
      analyzeSingle(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSingle = (data) => {
    if (!data.length) {
      setAnalysis({ avgScore: 0, feedback: "No quiz attempts for this subject." });
      return;
    }
    const total = data.reduce((s, x) => s + x.score, 0);
    const avg = Math.round(total / data.length);

    let feedback = "";
    if (avg >= 80) feedback = "Excellent! Keep it up.";
    else if (avg >= 60) feedback = "Good work! Review low-score topics to improve.";
    else feedback = "Needs improvement — revise the weak areas.";

    const low = data.filter((i) => i.score < 60);
    if (low.length > 0) {
      feedback += `\n\nWeak Topics: ${low.map((x) => x.topicTitle).join(", ")}`;
    }
    setAnalysis({ avgScore: avg, feedback });
  };

  // --- Chart Configurations ---

  // 1. Single Subject (Topic Breakdown)
  const singleSubjectChartData = {
    labels: topicData.map((d) => d.topicTitle),
    datasets: [
      {
        label: "Topic Score (%)",
        data: topicData.map((d) => d.score),
        backgroundColor: topicData.map((d) =>
          d.score < 60 ? "rgba(239, 68, 68, 0.7)" : "rgba(59, 130, 246, 0.7)"
        ),
        borderRadius: 5,
      },
    ],
  };

  // 2. All Subjects (Subject Comparison)
  const allSubjectsChartData = {
    labels: allSubjectsData.map(d => d.subject),
    datasets: [
        {
            label: "Subject Average (%)",
            data: allSubjectsData.map(d => d.average),
            backgroundColor: allSubjectsData.map(d => 
                d.average >= 80 ? "rgba(34, 197, 94, 0.7)" : // Green
                d.average >= 60 ? "rgba(234, 179, 8, 0.7)" : // Yellow
                "rgba(239, 68, 68, 0.7)" // Red
            ),
            borderRadius: 8,
        }
    ]
  };

  // 3. Doughnut (Global Score)
  const doughnutData = {
      labels: ['Average Score', 'Remaining'],
      datasets: [
          {
              data: [analysis.avgScore, 100 - analysis.avgScore],
              backgroundColor: ['#3b82f6', 'rgba(255,255,255,0.1)'],
              borderWidth: 0,
          }
      ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#fff" } },
      title: { display: false },
    },
    scales: {
      x: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
      y: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" }, min: 0, max: 100 },
    },
  };

  // --- Rendering ---
  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Analyzing performance...</p>
      </div>
    );
  }

  if (finishedSubjects.length === 0) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>Your Performance</h1>
        <p style={styles.noSubjects}>You haven't completed any courses yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Performance Overview</h1>
        <p style={styles.subtitle}>Track your progress across all subjects</p>
      </header>

      {/* Subject Selector */}
      <div style={styles.selectorBox}>
        <label style={styles.selectorLabel}>View:</label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={styles.select}
        >
          <option value="ALL"> All Subjects Overview</option>
          <option disabled>──────────</option>
          {finishedSubjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Main Analysis Card */}
      <div style={styles.card}>
        <div style={styles.cardHeaderRow}>
            <h2 style={styles.cardTitle}>
                {selectedSubject === "ALL" ? "All Subjects Performance" : `${selectedSubject} Analysis`}
            </h2>
            <div style={styles.scoreBadge}>
                Avg: {analysis.avgScore}%
            </div>
        </div>

        <p style={styles.feedback}>{analysis.feedback}</p>

        <div style={styles.vizGrid}>
            {/* Main Bar Chart */}
            <div style={styles.chartContainer}>
            {selectedSubject === "ALL" ? (
                 <Bar data={allSubjectsChartData} options={chartOptions} />
            ) : (
                topicData.length > 0 ? (
                    <Bar data={singleSubjectChartData} options={chartOptions} />
                ) : <p style={styles.noChartData}>No quiz data available.</p>
            )}
            </div>

            {/* Side Stats (Doughnut) - Only visible on large screens usually, but good for summary */}
            <div style={styles.doughnutContainer}>
                <h4 style={{textAlign:'center', marginBottom: 10, color:'#cbd5e1'}}>Overall Mastery</h4>
                <div style={{height: 150, position: 'relative'}}>
                     <Doughnut data={doughnutData} options={{cutout: '70%', plugins: {legend: {display: false}}}} />
                     <div style={styles.doughnutText}>{analysis.avgScore}%</div>
                </div>
            </div>
        </div>
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
    flexDirection: "column",
    alignItems: "center",
  },
  header: { textAlign: "center", marginBottom: "30px" },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    background: "linear-gradient(90deg, #2563eb, #60a5fa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0
  },
  subtitle: { fontSize: "1rem", color: "#cbd5e1", marginTop: 5 },
  
  /* ✅ UPDATED: Darker container to make White Text visible */
  selectorBox: {
    background: "rgba(15, 23, 42, 0.6)", // Darker semi-transparent blue-black
    padding: "12px 25px",
    borderRadius: "50px", // More rounded pill shape
    border: "1px solid rgba(96, 165, 250, 0.3)", // Subtle Blue border
    marginBottom: "30px",
    display: "flex",
    gap: "15px",
    alignItems: "center",
    width: "100%",
    maxWidth: "500px",
    backdropFilter: "blur(12px)", // Stronger blur
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)", // strong shadow for depth
    transition: "all 0.3s ease",
  },

  selectorLabel: {
    fontWeight: "700",
    color: "#60a5fa", // Bright Blue label for contrast
    fontSize: "1rem",
    whiteSpace: "nowrap",
  },

  /* ✅ UPDATED: Select Input styling */
  select: {
    flex: 1,
    padding: "10px",
    background: "transparent", // Keep transparent to show the dark box behind it
    border: "none",
    color: "#195be7ff", // Pure White Text
    fontSize: "1rem",
    fontWeight: "500",
    outline: "none",
    cursor: "pointer",
    appearance: "none", 
    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0px center",
    backgroundSize: "12px",
  },

  /* ✅ UPDATED: Fix for Options */
  option: {
    backgroundColor: "#1e293b", // Dark background for the dropdown list
    color: "#ffffffff", // White text in the list
    padding: "10px",
  },

  /* --- DELETED DUPLICATES HERE (This is where the error was) --- */

  card: {
    width: "100%",
    maxWidth: "1000px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "30px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
  },
  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: 10
  },
  cardTitle: { fontSize: "1.5rem", color: "#fff", margin: 0 },
  scoreBadge: {
      background: "#2563eb",
      padding: "5px 15px",
      borderRadius: "15px",
      fontWeight: "bold",
      fontSize: "0.9rem"
  },
  feedback: {
    background: "rgba(34, 197, 94, 0.1)",
    borderLeft: "4px solid #22c55e",
    padding: "15px",
    borderRadius: "5px",
    color: "#d1fae5",
    marginBottom: "25px",
    whiteSpace: "pre-line",
  },

  vizGrid: {
      display: "grid",
      gridTemplateColumns: "3fr 1fr",
      gap: "30px",
      alignItems: "center",
  },

  chartContainer: {
    height: "350px",
    background: "rgba(0,0,0,0.2)",
    borderRadius: "15px",
    padding: "15px",
    minWidth: "0", // Flexbox fix
  },
  
  doughnutContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.2)",
      borderRadius: "15px",
      padding: "20px",
      height: "350px"
  },
  doughnutText: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#fff'
  },

  noChartData: { textAlign: "center", padding: "80px", opacity: 0.6 },
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
  loadingText: { color: "#fff", marginTop: "15px" },
  noSubjects: { marginTop: "40px", color: "#cbd5e1" },
};

// Responsive fix for small screens
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@media (max-width: 768px) {
    .vizGrid { grid-template-columns: 1fr !important; }
}
`;
document.head.appendChild(styleSheet);

export default PerformancePage;