import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

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
      const res = await fetch(`${API_BASE_URL}/api/all-subjects`);
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
      await fetch(`${API_BASE_URL}/api/subjects/${id}`, { method: "DELETE" });
      setSubjects(subjects.filter((s) => s._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-subject/${id}`); // pass _id to match backend
  };

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
  return (
    <div style={styles.page}>
      <h2 style={{ textAlign: "center", marginTop: "50px", color: "#ffd700" }}>
        Loading subjects...
      </h2>
    </div>
  );


  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}> Manage Subjects</h1>

        <input
          type="text"
          placeholder="🔍 Search subjects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        {filteredSubjects.length === 0 ? (
          <p style={styles.empty}>No subjects found.</p>
        ) : (
          filteredSubjects.map((subject) => (
            <div key={subject._id} style={styles.card}>
              <div style={styles.subjectHeader}>
                {subject.icon && (
                  <img src={subject.icon} alt="icon" style={styles.icon} />
                )}
                <h3 style={styles.subjectName}>{subject.name}</h3>
              </div>
              <p style={styles.desc}>
                {subject.introduction?.overview || "No overview available."}
              </p>
              <div style={styles.actions}>
                <button
                  style={styles.editBtn}
                  onClick={() => handleEdit(subject._id)}
                >
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
        )}
      </div>
    </div>
  );
}
// Styles (unchanged)
const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #0c111b, #1b2430)", color: "#fff", fontFamily: "'Poppins', sans-serif", padding: "50px 20px", display: "flex", justifyContent: "center" },
  container: { width: "100%", maxWidth: "950px", backdropFilter: "blur(15px)", display: "flex", flexDirection: "column", gap: "20px" },
  title: { textAlign: "center", fontSize: "2.5rem", marginBottom: "25px", fontWeight: "700", color: "#ffd700", textShadow: "0 3px 15px rgba(0,0,0,0.7)" },
  search: { width: "100%", padding: "14px 20px", borderRadius: "15px", border: "none", outline: "none", marginBottom: "20px", background: "rgba(255,255,255,0.05)", color: "#fef9f3", fontSize: "1rem", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5)", backdropFilter: "blur(5px)", transition: "all 0.3s ease" },
  card: { background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "25px", boxShadow: "0 10px 35px rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.15)", transition: "all 0.3s ease", backdropFilter: "blur(10px)" },
  subjectHeader: { display: "flex", alignItems: "center", gap: "15px" },
  icon: { width: "45px", height: "45px", borderRadius: "10px", objectFit: "cover", boxShadow: "0 4px 15px rgba(0,0,0,0.5)" },
  subjectName: { color: "#ffd700", fontSize: "1.5rem", margin: 0, fontWeight: "600", textShadow: "0 2px 8px rgba(0,0,0,0.7)" },
  desc: { marginTop: "10px", color: "#cbd5e1", fontSize: "1rem", lineHeight: "1.5" },
  actions: { display: "flex", gap: "12px", marginTop: "15px" },
  editBtn: { background: "linear-gradient(135deg, #222, #444)", border: "none", padding: "10px 20px", borderRadius: "25px", color: "#ffd700", cursor: "pointer", fontWeight: "600", boxShadow: "0 6px 20px rgba(0,0,0,0.6)", transition: "all 0.3s ease" },
  deleteBtn: { background: "linear-gradient(135deg, #4b0000, #a60000)", border: "none", padding: "10px 20px", borderRadius: "25px", color: "#fff", cursor: "pointer", fontWeight: "600", boxShadow: "0 6px 20px rgba(0,0,0,0.6)", transition: "all 0.3s ease" },
  empty: { textAlign: "center", color: "#aaa", marginTop: "20px", fontSize: "1.1rem" },
};

export default ManageSubjects;
