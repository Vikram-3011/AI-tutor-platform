import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function EditSubject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/subjects/id/${id}`);
        if (!res.ok) throw new Error("Failed to fetch subject");
        const data = await res.json();
        setSubject({
          ...data,
          topics: data.topics || [],
          introduction: data.introduction || {},
        });
      } catch (err) {
        console.error("Error fetching subject:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!subject) return <p>Subject not found.</p>;

  const handleIntroChange = (field, value) => {
    setSubject({
      ...subject,
      introduction: { ...subject.introduction, [field]: value },
    });
  };

  const handleTopicChange = (index, field, value) => {
    const updatedTopics = [...subject.topics];
    updatedTopics[index] = { ...updatedTopics[index], [field]: value };
    setSubject({ ...subject, topics: updatedTopics });
  };

  // ✅ Fix: examples are objects with description and code
  const handleExampleChange = (topicIndex, exampleIndex, field, value) => {
    const updatedTopics = [...subject.topics];
    const examples = updatedTopics[topicIndex].examples || [];
    examples[exampleIndex] = { ...examples[exampleIndex], [field]: value };
    updatedTopics[topicIndex].examples = examples;
    setSubject({ ...subject, topics: updatedTopics });
  };

  const addTopic = () => {
    setSubject({
      ...subject,
      topics: [
        ...subject.topics,
        { title: "", content: "", examples: [{ description: "", code: "" }] },
      ],
    });
    setCurrentTopic(subject.topics.length + 1);
  };

  const removeTopic = (index) => {
    const updatedTopics = subject.topics.filter((_, i) => i !== index);
    setSubject({ ...subject, topics: updatedTopics });
    setCurrentTopic(Math.max(0, currentTopic - 1));
  };

  const addExample = (topicIndex) => {
    const updatedTopics = [...subject.topics];
    updatedTopics[topicIndex].examples.push({ description: "", code: "" });
    setSubject({ ...subject, topics: updatedTopics });
  };

  const removeExample = (topicIndex, exampleIndex) => {
    const updatedTopics = [...subject.topics];
    updatedTopics[topicIndex].examples.splice(exampleIndex, 1);
    setSubject({ ...subject, topics: updatedTopics });
  };

  const handleNextTopic = () => {
    if (currentTopic < subject.topics.length) setCurrentTopic(currentTopic + 1);
  };
  const handlePrevTopic = () => {
    if (currentTopic > 0) setCurrentTopic(currentTopic - 1);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/subjects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subject),
      });
      if (!res.ok) throw new Error("Update failed");
      alert(" Subject updated successfully!");
      navigate("/manage-subjects");
    } catch (err) {
      console.error(err);
      alert(" Failed to update subject");
    }
  };

  const displayIntro = currentTopic === 0;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}> Edit Subject: {subject.name}</h1>
      <div style={styles.card}>
        <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
          {displayIntro ? (
            <>
              <label style={styles.label}>Overview</label>
              <textarea
                style={styles.textarea}
                value={subject.introduction.overview || ""}
                onChange={(e) => handleIntroChange("overview", e.target.value)}
              />
              <label style={styles.label}>Why Learn</label>
              <textarea
                style={styles.textarea}
                value={subject.introduction.why_learn || ""}
                onChange={(e) => handleIntroChange("why_learn", e.target.value)}
              />
              <label style={styles.label}>Purpose</label>
              <textarea
                style={styles.textarea}
                value={subject.introduction.purpose || ""}
                onChange={(e) => handleIntroChange("purpose", e.target.value)}
              />
              <button type="button" style={styles.addBtn} onClick={addTopic}>
                + Add Topic
              </button>
            </>
          ) : (
            <>
              {subject.topics[currentTopic - 1] && (
                <div style={styles.topicCard}>
                  <label style={styles.label}>Title</label>
                  <input
                    style={styles.input}
                    value={subject.topics[currentTopic - 1].title}
                    onChange={(e) =>
                      handleTopicChange(
                        currentTopic - 1,
                        "title",
                        e.target.value
                      )
                    }
                  />
                  <label style={styles.label}>Content</label>
                  <textarea
                    style={styles.textarea}
                    value={subject.topics[currentTopic - 1].content}
                    onChange={(e) =>
                      handleTopicChange(
                        currentTopic - 1,
                        "content",
                        e.target.value
                      )
                    }
                  />

                  <label style={styles.label}>Examples</label>
                  {subject.topics[currentTopic - 1].examples?.map(
                    (ex, exIdx) => (
                      <div key={exIdx} style={styles.exampleBlock}>
                        <input
                          placeholder="Description"
                          style={styles.inputSmall}
                          value={ex.description || ""}
                          onChange={(e) =>
                            handleExampleChange(
                              currentTopic - 1,
                              exIdx,
                              "description",
                              e.target.value
                            )
                          }
                        />
                        <input
                          placeholder="Code"
                          style={styles.inputSmall}
                          value={ex.code || ""}
                          onChange={(e) =>
                            handleExampleChange(
                              currentTopic - 1,
                              exIdx,
                              "code",
                              e.target.value
                            )
                          }
                        />
                        <button
                          type="button"
                          style={styles.deleteBtnSmall}
                          onClick={() =>
                            removeExample(currentTopic - 1, exIdx)
                          }
                        >
                          ❌
                        </button>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    style={styles.addBtnSmall}
                    onClick={() => addExample(currentTopic - 1)}
                  >
                    + Add Example
                  </button>

                  <button
                    type="button"
                    style={styles.deleteBtn}
                    onClick={() => removeTopic(currentTopic - 1)}
                  >
                     Remove Topic
                  </button>
                </div>
              )}
            </>
          )}

          <div style={styles.navButtons}>
            <button
              type="button"
              style={styles.secondaryBtn}
              onClick={() =>
                currentTopic === 0
                  ? navigate("/manage-subjects")
                  : handlePrevTopic()
              }
            >
              {currentTopic === 0 ? "⬅ Back" : "← Previous"}
            </button>

            {currentTopic < subject.topics.length ? (
              <button
                type="button"
                style={styles.primaryBtn}
                onClick={handleNextTopic}
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                style={styles.primaryBtn}
                onClick={handleSubmit}
              >
                 Save
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// 🎨 Clean, compact styles
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0c111b",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 40,
  },
  title: { color: "#fff", fontSize: "1.8rem", marginBottom: 20 },
  card: {
    width: "100%",
    maxWidth: 800,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 20,
    backdropFilter: "blur(10px)",
  },
  label: { color: "#fff", marginBottom: 5, fontWeight: 600 },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
  },
  inputSmall: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
  },
  textarea: {
    width: "100%",
    minHeight: 80,
    padding: 10,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    resize: "vertical",
  },
  topicCard: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 15,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 10,
  },
  exampleBlock: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  addBtn: {
    background: "#3b82f6",
    color: "#fff",
    padding: "8px 15px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  addBtnSmall: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: 8,
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  deleteBtnSmall: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },
  navButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20,
  },
  primaryBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 25,
    padding: "10px 25px",
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: 25,
    padding: "10px 20px",
    cursor: "pointer",
  },
};

export default EditSubject;
