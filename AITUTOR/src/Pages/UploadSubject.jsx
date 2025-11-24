import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

function UploadSubject() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [overview, setOverview] = useState("");
  const [whyLearn, setWhyLearn] = useState("");
  const [purpose, setPurpose] = useState("");

  const [topics, setTopics] = useState([]);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicContent, setTopicContent] = useState("");
  const [examples, setExamples] = useState([]);
  const [exampleDescription, setExampleDescription] = useState("");
  const [exampleCode, setExampleCode] = useState("");

  const [isTopicSaved, setIsTopicSaved] = useState(false);
  const [isExampleSaved, setIsExampleSaved] = useState(false);
  const [step, setStep] = useState(1);
  const [finalizeMode, setFinalizeMode] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState("");

  // --- LOGIC SECTION START ---

  // 1. Manual Add Example
  const addExample = () => {
    if (!exampleDescription || !exampleCode) return setMessage(" Fill both example fields.");
    setExamples([...examples, { description: exampleDescription, code: exampleCode }]);
    setExampleDescription("");
    setExampleCode("");
    setMessage(" Example added!");
  };

  // 2. Save Examples (Auto-adds pending input)
  const saveExamples = () => {
    let finalExamples = [...examples];
    if (exampleDescription && exampleCode) {
        finalExamples.push({ description: exampleDescription, code: exampleCode });
        setExamples(finalExamples);
        setExampleDescription("");
        setExampleCode("");
    }
    if (finalExamples.length === 0) return setMessage(" Add at least one example first.");
    setIsExampleSaved(true);
    setMessage(" Examples saved.");
  };

  // 3. Manual Add Topic
  const addTopic = () => {
    if (!topicTitle || !topicContent) return setMessage(" Fill topic title & content.");
    if (!isExampleSaved || examples.length === 0) return setMessage(" Save examples first.");
    setTopics([...topics, { title: topicTitle, content: topicContent, examples }]);
    setTopicTitle("");
    setTopicContent("");
    setExamples([]);
    setIsTopicSaved(true);
    setIsExampleSaved(false);
    setMessage(" Topic saved!");
  };

  // 4. NEW: Handle Next Button (Auto-processes Topic + Example)
  const handleNextToFinalize = () => {
    // Capture current state locally
    let currentTopics = [...topics];
    let currentExamples = [...examples];

    // A. Check if there is a pending Example in inputs
    if (exampleDescription && exampleCode) {
      currentExamples.push({ description: exampleDescription, code: exampleCode });
    }

    // B. Check if there is a pending Topic in inputs
    if (topicTitle && topicContent) {
      // Validate: Does this pending topic have examples (either in array or just added)?
      if (currentExamples.length === 0) {
        return setMessage(" Please add at least one example for the current topic.");
      }

      // Create the new topic object
      const newTopic = {
        title: topicTitle,
        content: topicContent,
        examples: currentExamples
      };

      // Add it to the list
      currentTopics.push(newTopic);
      setIsTopicSaved(true); // Mark valid
    }

    // C. Final Check: Do we have any topics to proceed?
    if (currentTopics.length === 0) {
      return setMessage(" You must add at least one topic before finalizing.");
    }

    // D. Update State and Move Next
    setTopics(currentTopics);
    
    // Clear current inputs so they don't linger
    setTopicTitle("");
    setTopicContent("");
    setExamples([]);
    setExampleDescription("");
    setExampleCode("");
    
    setStep(4);
  };

  // --- LOGIC SECTION END ---

  const finalizeSubject = () => {
    if (!name || !overview || !whyLearn || !purpose || topics.length === 0)
      return setMessage(" Complete all fields & add at least one topic.");
    // isTopicSaved check removed here because handleNextToFinalize ensures topics exist
    setFinalizeMode(true);
    setMessage(" Ready to upload!");
  };

  const saveSubject = async () => {
    const subjectData = {
      name,
      icon,
      introduction: { overview, why_learn: whyLearn, purpose },
      topics,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(errorData.message || " Upload failed.");
        return;
      }

      setShowDialog(true);

      setTimeout(() => {
        setShowDialog(false);
        navigate("/Explore");
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage(" Error uploading subject.");
    }
  };

  const steps = ["Basic Info", "Introduction", "Topics", "Finalize"];

  return (
    <div style={styles.page}>
      
      {/* --- MODIFIED HEADER SECTION START --- */}
      <div style={styles.headerContainer}>
        <div style={styles.headerText}>
            <h1 style={styles.title}>Upload New Subject</h1>
            <p style={styles.subtitle}>Add subject content just like creating a course</p>
        </div>
        
        <button 
          style={styles.addQuizBtn} 
          onClick={() => navigate("/upload-quiz")}
        >
          + Add Quiz
        </button>
      </div>
      {/* --- MODIFIED HEADER SECTION END --- */}

      <div style={styles.container}>
        {/* PROGRESS BAR */}
        <div style={styles.progressBar}>
          {steps.map((label, idx) => {
            const isCompleted = step > idx + 1;
            const isActive = step === idx + 1;
            return (
              <div key={idx} style={styles.stepItem}>
                <div
                  style={{
                    ...styles.stepCircle,
                    background: isCompleted
                      ? "#22c55e"
                      : isActive
                      ? "#3b82f6"
                      : "rgba(255,255,255,0.2)",
                  }}
                >
                  {isCompleted ? "✔" : idx + 1}
                </div>
                <span style={styles.stepText}>{label}</span>
              </div>
            );
          })}
        </div>

        {message && <p style={styles.message}>{message}</p>}

        {/* STEP CONTENT UI */}
        <div style={styles.sectionCard}>
          {step === 1 && (
            <>
              <input
                style={styles.input}
                placeholder="Subject Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <button
                style={styles.primaryBtn}
                disabled={!name}
                onClick={() => setStep(2)}
              >
                Next → Introduction
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <textarea
                style={styles.textarea}
                placeholder="Overview *"
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
              />

              <textarea
                style={styles.textarea}
                placeholder="Why Learn *"
                value={whyLearn}
                onChange={(e) => setWhyLearn(e.target.value)}
              />

              <textarea
                style={styles.textarea}
                placeholder="Purpose *"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />

              <div style={styles.rowBtns}>
                <button style={styles.secondaryBtn} onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button
                  style={styles.primaryBtn}
                  disabled={!overview || !whyLearn || !purpose}
                  onClick={() => setStep(3)}
                >
                  Next → Topics
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {topics.map((t, idx) => (
                <div key={idx} style={styles.topicCard}>
                  <h4 style={{ color: "#60a5fa" }}>{t.title}</h4>
                  <p>{t.content}</p>

                  {t.examples.map((ex, i) => (
                    <div key={i} style={styles.exampleCard}>
                      <p>{ex.description}</p>
                      <pre style={styles.codeBlock}>{ex.code}</pre>
                    </div>
                  ))}
                </div>
              ))}

              <input
                style={styles.input}
                placeholder="Topic Title *"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
              />
              <textarea
                style={styles.textarea}
                placeholder="Topic Content *"
                value={topicContent}
                onChange={(e) => setTopicContent(e.target.value)}
              />

              <h4 style={styles.sectionSubtitle}>Add Examples</h4>

              <input
                style={styles.input}
                placeholder="Example Description *"
                value={exampleDescription}
                onChange={(e) => setExampleDescription(e.target.value)}
              />
              <textarea
                style={styles.textarea}
                placeholder="Example Code *"
                value={exampleCode}
                onChange={(e) => setExampleCode(e.target.value)}
              />

              <div style={styles.rowBtns}>
                <button style={styles.secondaryBtn} onClick={addExample}>
                  Add Example
                </button>
                <button style={styles.primaryBtn} onClick={saveExamples}>
                  Save Examples
                </button>
              </div>

              <div style={styles.rowBtns}>
                <button style={styles.primaryBtn} onClick={addTopic}>
                  Add Topic
                </button>
              </div>

              <div style={styles.rowBtns}>
                <button style={styles.secondaryBtn} onClick={() => setStep(2)}>
                  ← Back
                </button>
                {/* CHANGED: Button now calls handleNextToFinalize and isn't disabled by empty topics list */}
                <button
                  style={styles.primaryBtn}
                  onClick={handleNextToFinalize}
                >
                  Next → Finalize
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <p><strong>Subject:</strong> {name}</p>
              <p><strong>Overview:</strong> {overview}</p>
              <p><strong>Why Learn:</strong> {whyLearn}</p>
              <p><strong>Purpose:</strong> {purpose}</p>

              <h4 style={{ marginTop: 15 }}>Topics</h4>
              {topics.map((t, idx) => (
                <div key={idx} style={styles.topicCard}>
                  <h4>{t.title}</h4>
                  <p>{t.content}</p>
                </div>
              ))}

              <div style={styles.rowBtns}>
                <button style={styles.secondaryBtn} onClick={() => setStep(3)}>
                  ← Back
                </button>

                {!finalizeMode ? (
                  <button style={styles.primaryBtn} onClick={finalizeSubject}>
                    Finalize Subject
                  </button>
                ) : (
                  <button style={styles.primaryBtn} onClick={saveSubject}>
                     Upload Now
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {showDialog && (
          <div style={styles.dialogOverlay}>
            <div style={styles.dialogBox}>Subject Uploaded Successfully! 🎉</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------- MATCHED EXPLORE UI STYLES --------------------- */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "60px 20px",
    background: "radial-gradient(circle at 20% 20%, #0f172a, #020617 70%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
    color: "#fff",
  },

  /* --- NEW HEADER CONTAINER STYLE --- */
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "900px", // Matches the container width
    marginBottom: "40px",
  },

  headerText: {
    textAlign: "left",
  },

  title: {
    fontSize: "2.8rem",
    fontWeight: "700",
    background: "linear-gradient(90deg, #2563eb, #60a5fa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },

  subtitle: {
    fontSize: "1.1rem",
    color: "#cbd5e1",
    marginTop: "8px",
  },

  container: {
    width: "100%",
    maxWidth: "900px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "20px",
    padding: "35px",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(25px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },

  progressBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "25px",
  },

  stepItem: {
    textAlign: "center",
    flex: 1,
  },

  stepCircle: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "#fff",
    margin: "0 auto 5px",
  },

  stepText: {
    fontSize: "0.9rem",
    color: "#cbd5e1",
  },

  message: {
    background: "rgba(255,255,255,0.1)",
    padding: "12px",
    borderRadius: "12px",
    textAlign: "center",
    color: "#90ee90",
    marginBottom: "15px",
  },

  sectionCard: {
    background: "rgba(255,255,255,0.04)",
    padding: "25px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },

  input: {
    width: "100%",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "12px",
  },

  textarea: {
    width: "100%",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "12px",
    resize: "vertical",
  },

  topicCard: {
    background: "rgba(255,255,255,0.06)",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "15px",
    border: "1px solid rgba(255,255,255,0.15)",
  },

  exampleCard: {
    background: "rgba(255,255,255,0.08)",
    padding: "10px",
    borderRadius: "10px",
    marginTop: "5px",
  },

  codeBlock: {
    background: "#111827",
    color: "#a5b4fc",
    padding: "8px",
    borderRadius: "8px",
    marginTop: "5px",
    fontSize: "0.85rem",
  },

  sectionSubtitle: {
    marginTop: "10px",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#60a5fa",
  },

  rowBtns: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "15px",
  },

  primaryBtn: {
    background: "linear-gradient(90deg, #2563eb, #3b82f6)",
    padding: "12px 24px",
    borderRadius: "25px",
    border: "none",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 5px 20px rgba(0,0,0,0.4)",
  },

  secondaryBtn: {
    background: "rgba(255,255,255,0.15)",
    padding: "10px 20px",
    borderRadius: "25px",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.25)",
    cursor: "pointer",
  },

  dialogOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  dialogBox: {
    background: "#fff",
    color: "#000",
    padding: "30px 40px",
    borderRadius: "12px",
    fontWeight: "600",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
  },

  addQuizBtn: {
    background: "linear-gradient(90deg, #8ec8faff, #115cb2ff)", 
    color: "#0f172a",
    border: "none",
    padding: "12px 24px",
    borderRadius: "30px",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(13, 41, 204, 0.4)",
    transition: "transform 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0, 
  }
};

export default UploadSubject;