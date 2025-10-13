import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

function EditSubject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch subject by ID
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/subjects/${id}`);
        if (!res.ok) throw new Error("Failed to fetch subject");
        const data = await res.json();
        setSubject({
          ...data,
          topics: data.topics || [], // Ensure topics array exists
          introduction: data.introduction || {}, // Ensure introduction exists
        });
      } catch (err) {
        console.error("Error fetching subject:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id]);

  // Handle changes in main fields
  const handleInputChange = (field, value) => {
    setSubject({ ...subject, [field]: value });
  };

  // Handle changes in introduction fields
  const handleIntroChange = (field, value) => {
    setSubject({
      ...subject,
      introduction: { ...subject.introduction, [field]: value },
    });
  };

  // Handle changes in a topic
  const handleTopicChange = (index, field, value) => {
    const updatedTopics = [...subject.topics];
    updatedTopics[index] = { ...updatedTopics[index], [field]: value };
    setSubject({ ...subject, topics: updatedTopics });
  };

  // Add a new topic
  const addTopic = () => {
    setSubject({
      ...subject,
      topics: [...subject.topics, { title: "", content: "", example: "" }],
    });
  };

  // Remove a topic
  const removeTopic = (index) => {
    const updatedTopics = subject.topics.filter((_, i) => i !== index);
    setSubject({ ...subject, topics: updatedTopics });
  };

  // Submit updated subject
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/subjects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subject),
      });
      if (!res.ok) throw new Error("Failed to update subject");
      alert("✅ Subject updated successfully!");
      navigate("/manage-subjects");
    } catch (error) {
      console.error("Error updating subject:", error);
      alert("❌ Failed to update subject.");
    }
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px", color: "#fff" }}>
        Loading...
      </h2>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>✏️ Edit Subject</h1>
        <form onSubmit={handleSubmit}>
          {/* Subject Main Fields */}
          <input
            style={styles.input}
            value={subject.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Subject Name"
            required
          />
          <input
            style={styles.input}
            value={subject.icon || ""}
            onChange={(e) => handleInputChange("icon", e.target.value)}
            placeholder="Icon URL"
          />
          <textarea
            style={styles.textarea}
            value={subject.introduction?.overview || ""}
            onChange={(e) => handleIntroChange("overview", e.target.value)}
            placeholder="Overview"
            required
          />
          <textarea
            style={styles.textarea}
            value={subject.introduction?.why_learn || ""}
            onChange={(e) => handleIntroChange("why_learn", e.target.value)}
            placeholder="Why Learn"
            required
          />
          <textarea
            style={styles.textarea}
            value={subject.introduction?.purpose || ""}
            onChange={(e) => handleIntroChange("purpose", e.target.value)}
            placeholder="Purpose"
            required
          />

          {/* Topics Section */}
          <h2 style={styles.subtitle}>📚 Topics</h2>
          {subject.topics.map((topic, index) => (
            <div key={index} style={styles.topicCard}>
              <input
                style={styles.input}
                value={topic.title || ""}
                onChange={(e) =>
                  handleTopicChange(index, "title", e.target.value)
                }
                placeholder="Topic Title"
                required
              />
              <textarea
                style={styles.textarea}
                value={topic.content || ""}
                onChange={(e) =>
                  handleTopicChange(index, "content", e.target.value)
                }
                placeholder="Topic Content"
                required
              />
              <textarea
                style={styles.textarea}
                value={topic.example || ""}
                onChange={(e) =>
                  handleTopicChange(index, "example", e.target.value)
                }
                placeholder="Example"
              />
              <button
                type="button"
                style={styles.deleteBtn}
                onClick={() => removeTopic(index)}
              >
                ❌ Remove Topic
              </button>
            </div>
          ))}
          <button type="button" style={styles.addBtn} onClick={addTopic}>
            ➕ Add Topic
          </button>

          <button type="submit" style={styles.saveBtn}>
            💾 Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

// Styles (kept similar to your ManageSubjects page)
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
  },
  container: {
    width: "100%",
    maxWidth: "900px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "15px",
    padding: "25px",
    backdropFilter: "blur(15px)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  },
  title: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "20px",
  },
  subtitle: {
    marginTop: "20px",
    fontSize: "1.3rem",
    color: "#4cc9f0",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "none",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    marginBottom: "10px",
    resize: "vertical",
  },
  topicCard: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "10px",
  },
  addBtn: {
    background: "#3b82f6",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    marginTop: "10px",
  },
  deleteBtn: {
    background: "#ef4444",
    border: "none",
    padding: "6px 15px",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    marginTop: "5px",
  },
  saveBtn: {
    background: "#22c55e",
    border: "none",
    padding: "12px 25px",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    display: "block",
    marginTop: "20px",
  },
};

export default EditSubject;
