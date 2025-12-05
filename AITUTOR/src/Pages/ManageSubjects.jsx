import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VITE_API_BASE_URL = "https://ai-tutor-khaki.vercel.app/";

function ManageSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/all-subjects`);
      const data = await res.json();
      setSubjects(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await fetch(`${VITE_API_BASE_URL}/api/subjects/${id}`, { method: "DELETE" });
      setSubjects(subjects.filter((s) => s._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-subject/${id}`);
  };

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading subjects...</p>
      </div>
    );

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Manage Subjects</h1>
        <p style={styles.subtitle}>Edit or remove subjects you have created.</p>
      </header>

    <input
        type="text"
        placeholder=" Search subjects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      <div style={styles.grid}>
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject) => (
            <div key={subject._id} style={styles.card}>
              <div style={styles.cardHeader}>
                {subject.icon && (
                  <img src={subject.icon} alt="icon" style={styles.icon} />
                )}
                <h3 style={styles.cardTitle}>{subject.name}</h3>
              </div>

              <p style={styles.cardDesc}>
                {subject.introduction?.overview || "No overview available."}
              </p>

              <div style={styles.actions}>
                <button style={styles.editBtn} onClick={() => handleEdit(subject._id)}>
                  Edit
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(subject._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.noSubjects}>No subjects found.</p>
        )}
      </div>
    </div>

    
  );
}

// --------------------
// STYLES — MATCH EXPLORE PAGE
// --------------------
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
    textAlign: "left",
    marginBottom: "30px",
  },
  title: {
    fontSize: "2.8rem",
    fontWeight: "700",
    background: "linear-gradient(90deg, #facc15, #fde047)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0",
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: "1.1rem",
    marginTop: "10px",
  },

  search: {
    width: "100%",
    maxWidth: "600px",
    padding: "14px 20px",
    borderRadius: "15px",
    border: "none",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: "1rem",
    backdropFilter: "blur(10px)",
    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)",
    marginBottom: "40px",
    outline: "none",
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.3s ease",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  icon: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    objectFit: "cover",
    boxShadow: "0 0 12px rgba(255,255,255,0.15)",
  },

  cardTitle: {
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#facc15",
  },

  cardDesc: {
    color: "#e2e8f0",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    marginTop: "15px",
  },

  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
  },
  editBtn: {
    background: "linear-gradient(90deg, #2563eb, #3b82f6)",
    border: "none",
    padding: "10px 20px",
    borderRadius: "25px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s",
  },
  deleteBtn: {
    background: "linear-gradient(90deg, #dc2626, #b91c1c)",
    border: "none",
    padding: "10px 20px",
    borderRadius: "25px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s",
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
  },

};

// Inject keyframes
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;
document.head.appendChild(styleSheet);

export default ManageSubjects;
