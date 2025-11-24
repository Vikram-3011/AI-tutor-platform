import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { API_BASE_URL } from "../config";

//  Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function SubjectDetail() {
  const { name, topicTitle } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  //  Notification state
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showNotification, setShowNotification] = useState(false);

  //  Get logged-in Supabase user email
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email);
    };
    getUser();
  }, []);

  //  Fetch subject data
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/subjects/${name}`)
      .then((res) => res.json())
      .then((data) => {
        setSubject(data);
        setLoading(false);
        if (topicTitle && data.topics) {
          const index = data.topics.findIndex(
            (t) => t.title.toLowerCase() === topicTitle.toLowerCase()
          );
          if (index !== -1) setSelectedTopicIndex(index);
        }
      })
      .catch((err) => {
        console.error("Error fetching subject:", err);
        setLoading(false);
      });
  }, [name, topicTitle]);

  //  Notification helper
  const showNotif = (message, type = "success") => {
    setNotification({ message, type });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  //  Handle Add Course
  const handleAddCourse = async () => {
    if (!userEmail) {
      showNotif("Please login first to add this course.", "error");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/mycourses/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          subjectName: subject.name,
        }),
      });
      const data = await res.json();
      showNotif(data.message || "Course added successfully!", "success");
    } catch (err) {
      console.error(err);
      showNotif("Error adding course.", "error");
    }
  };

  //  Handle Finish Course (UPDATED LOGIC)
  const handleFinishCourse = async () => {
    if (!userEmail) return;
    try {
      await fetch(`${API_BASE_URL}/api/mycourses/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          subjectName: subject.name,
        }),
      });

      //  CHANGE: Redirect to Performance Page with state
      // This passes the subject name so the Performance page loads this subject's graph immediately
      navigate(`/performance`, { state: { subjectName: subject.name } });

    } catch (err) {
      console.error(err);
    }
  };

  const handleTakeQuiz = () => {
    const topic = subject.topics[selectedTopicIndex];
    navigate(`/take-quiz/${subject.name}/${topic.title}`);
  };

  if (loading)
    return (
      <div style={styles.page}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading subject...</p>
      </div>
    );

  if (!subject)
    return (
      <div style={styles.page}>
        <p style={{ textAlign: "center", color: "#fff" }}>Subject not found.</p>
      </div>
    );

  const currentTopic = subject.topics[selectedTopicIndex];
  const progress =
    subject.topics.length > 0
      ? Math.min(((selectedTopicIndex + 1) / subject.topics.length) * 100, 100)
      : 0;

  return (
    <div style={styles.page}>
      {/* Notification */}
      {showNotification && (
        <div
          style={{
            ...styles.notification,
            background:
              notification.type === "success"
                ? "linear-gradient(90deg, #16a34a, #22c55e)"
                : "linear-gradient(90deg, #dc2626, #ef4444)",
          }}
        >
          {notification.message}
        </div>
      )}

      <div style={styles.layout}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}> Topics</h2>
          <ul style={styles.topicList}>
            {subject.topics.map((topic, index) => (
              <li
                key={index}
                onClick={() => setSelectedTopicIndex(index)}
                style={{
                  ...styles.topicItem,
                  background:
                    index === selectedTopicIndex
                      ? "linear-gradient(90deg, #2563eb, #3b82f6)"
                      : "transparent",
                  color: index === selectedTopicIndex ? "#fff" : "#d1d5db",
                }}
              >
                {topic.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div style={styles.contentArea}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h1 style={styles.title}>{subject.name}</h1>
            <button
              style={{
                ...styles.primaryBtn,
                padding: "8px 20px",
                fontSize: "0.9rem",
              }}
              onClick={handleAddCourse}
            >
              + Add Course
            </button>
          </div>

          <p style={styles.subtitle}>
            Learn interactively and test your knowledge!
          </p>

          {/* Progress bar */}
          <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBar, width: `${progress}%` }} />
          </div>

          {/* Topic content */}
          <div style={styles.contentWrapper}>
            <div style={styles.content}>
              <h2 style={styles.topicTitle}>{currentTopic.title}</h2>
              <p style={styles.text}>{currentTopic.content}</p>

              {currentTopic.examples?.map((ex, idx) => (
                <div key={idx} style={styles.exampleCard}>
                  <p>
                    <strong>Example {idx + 1}:</strong> {ex.description}
                  </p>
                  <pre style={styles.code}>{ex.code}</pre>
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <div style={styles.buttonsContainer}>
              <button style={styles.quizBtn} onClick={handleTakeQuiz}>
                 Take Quiz on {currentTopic.title}
              </button>
              <div style={styles.navButtons}>
                <button
                  style={styles.secondaryBtn}
                  onClick={() => {
                    if (selectedTopicIndex > 0)
                      setSelectedTopicIndex(selectedTopicIndex - 1);
                    else navigate("/explore");
                  }}
                >
                  ⬅ {selectedTopicIndex > 0 ? "Previous" : "Back"}
                </button>

                <button
                  style={styles.primaryBtn}
                  onClick={async () => {
                    if (selectedTopicIndex < subject.topics.length - 1) {
                      setSelectedTopicIndex(selectedTopicIndex + 1);
                    } else {
                      await handleFinishCourse();
                    }
                  }}
                >
                  {selectedTopicIndex < subject.topics.length - 1
                    ? "Next →"
                    : "Finish 🎓"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------- STYLES ----------------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "'Poppins', sans-serif",
    padding: "20px",
    boxSizing: "border-box",
    overflow: "hidden",
    position: "relative",
  },
  notification: {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 25px",
    borderRadius: "25px",
    color: "#fff",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    zIndex: 999,
    animation: "fadeinout 3s forwards",
  },
  layout: {
    display: "flex",
    width: "100%",
    maxWidth: "1400px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
    minHeight: "80vh",
  },
  sidebar: {
    width: "280px",
    background: "rgba(255,255,255,0.07)",
    padding: "20px 15px",
    borderRight: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  sidebarTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#60a5fa",
    marginBottom: "15px",
  },
  topicList: { listStyle: "none", padding: 0, margin: 0 },
  topicItem: {
    padding: "10px 15px",
    borderRadius: "10px",
    marginBottom: "8px",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  contentArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "30px 40px",
  },
  title: { fontSize: "2rem", fontWeight: "700", color: "#3b82f6" },
  subtitle: { color: "#d1d5db", fontSize: "1rem", textAlign: "center" },
  progressBarContainer: {
    width: "100%",
    height: "8px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  progressBar: {
    height: "8px",
    background: "linear-gradient(90deg, #2563eb, #3b82f6)",
    borderRadius: "10px",
    transition: "width 0.5s ease",
  },
  contentWrapper: { display: "flex", flexDirection: "column" },
  content: { color: "#e2e8f0" },
  topicTitle: { fontSize: "1.7rem", color: "#93c5fd", marginBottom: "12px" },
  text: { fontSize: "1rem", lineHeight: "1.8" },
  exampleCard: {
    background: "rgba(255,255,255,0.08)",
    padding: "12px",
    borderRadius: "10px",
    marginTop: "12px",
  },
  code: {
    background: "#111827",
    padding: "10px",
    borderRadius: "8px",
    color: "#a5b4fc",
    overflowX: "auto",
  },
  buttonsContainer: { marginTop: "25px" },
  quizBtn: {
    background: "linear-gradient(90deg, #16a34a, #22c55e)",
    border: "none",
    borderRadius: "25px",
    padding: "10px 20px",
    fontWeight: "600",
    fontSize: "0.9rem",
    color: "#fff",
    cursor: "pointer",
    marginBottom: "15px",
  },
  navButtons: { display: "flex", justifyContent: "space-between", gap: "15px" },
  primaryBtn: {
    background: "linear-gradient(90deg, #2563eb, #3b82f6)",
    border: "none",
    borderRadius: "30px",
    padding: "12px 25px",
    fontWeight: "600",
    cursor: "pointer",
    color: "#fff",
  },
  secondaryBtn: {
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "25px",
    padding: "10px 20px",
    fontWeight: "500",
    cursor: "pointer",
    color: "#fff",
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
  loadingText: { color: "#fff", fontSize: "1.1rem" },
};

const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeinout {
  0% { opacity: 0; transform: translateY(-10px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
}`;
document.head.appendChild(styleSheet);

export default SubjectDetail;