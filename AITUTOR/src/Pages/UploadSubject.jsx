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

  // --- FUNCTIONS ---
  const addExample = () => {
    if (!exampleDescription || !exampleCode) return setMessage("⚠️ Fill both example fields.");
    setExamples([...examples, { description: exampleDescription, code: exampleCode }]);
    setExampleDescription(""); setExampleCode(""); setMessage("✅ Example added!");
  };

  const saveExamples = () => {
    if (examples.length === 0) return setMessage("⚠️ Add at least one example first.");
    setIsExampleSaved(true);
    setMessage("✅ Examples saved.");
  };

  const addTopic = () => {
    if (!topicTitle || !topicContent) return setMessage("⚠️ Fill topic title & content.");
    if (!isExampleSaved || examples.length === 0) return setMessage("⚠️ Save examples first.");
    setTopics([...topics, { title: topicTitle, content: topicContent, examples }]);
    setTopicTitle(""); setTopicContent(""); setExamples([]); setIsTopicSaved(true); setIsExampleSaved(false);
    setMessage("✅ Topic saved!");
  };

  const finalizeSubject = () => {
    if (!name || !overview || !whyLearn || !purpose || topics.length === 0) return setMessage("⚠️ Complete all fields & add at least one topic.");
    if (!isTopicSaved) return setMessage("⚠️ Save your last topic first.");
    setFinalizeMode(true);
    setMessage("✅ Ready to upload!");
  };

  const saveSubject = async () => {
    const subjectData = { name, icon, introduction: { overview, why_learn: whyLearn, purpose }, topics };
    try {
      const res = await fetch(`${API_BASE_URL}/api/subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setMessage(errorData.message || "❌ Upload failed.");
        return;
      }
      setShowDialog(true);
      setTimeout(() => { setShowDialog(false); navigate("/Explore"); }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error uploading subject.");
    }
  };

  const steps = ["Basic Info", "Introduction", "Topics", "Finalize"];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Upload New Subject</h1>
        <p style={styles.subtitle}>Create a subject step by step</p>

        {/* PROGRESS BAR */}
        <div style={styles.progressContainer}>
          {steps.map((label, idx) => {
            const isCompleted = step > idx + 1;
            const isActive = step === idx + 1;
            return (
              <div key={idx} style={styles.stepWrapper}>
                <div style={{
                  ...styles.stepCircle,
                  background: isCompleted ? "#22c55e" : isActive ? "#3b82f6" : "#555",
                }}>
                  {isCompleted ? "✔" : idx + 1}
                </div>
                <span style={styles.stepLabel}>{label}</span>
              </div>
            );
          })}
        </div>

        {message && <p style={styles.message}>{message}</p>}

        {/* STEP CONTENT */}
        {step === 1 && (
          <div style={styles.section}>
            <input style={styles.input} placeholder="Subject Name *" value={name} onChange={e => setName(e.target.value)} />
            <input style={styles.input} placeholder="Icon URL (optional)" value={icon} onChange={e => setIcon(e.target.value)} />
            <button style={styles.primaryBtn} disabled={!name} onClick={() => setStep(2)}>Next → Introduction</button>
          </div>
        )}

        {step === 2 && (
          <div style={styles.section}>
            <textarea style={styles.textarea} placeholder="Overview *" value={overview} onChange={e => setOverview(e.target.value)} />
            <textarea style={styles.textarea} placeholder="Why Learn *" value={whyLearn} onChange={e => setWhyLearn(e.target.value)} />
            <textarea style={styles.textarea} placeholder="Purpose *" value={purpose} onChange={e => setPurpose(e.target.value)} />
            <div style={styles.navBtns}>
              <button style={styles.secondaryBtn} onClick={() => setStep(1)}>← Back</button>
              <button style={styles.primaryBtn} disabled={!overview || !whyLearn || !purpose} onClick={() => setStep(3)}>Next → Topics</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={styles.section}>
            {topics.map((t, idx) => (
              <div key={idx} style={styles.topicCard}>
                <h4 style={{ color: "#4cc9f0" }}>{t.title}</h4>
                <p>{t.content}</p>
                {t.examples.length > 0 && t.examples.map((ex, i) => (
                  <div key={i} style={styles.exampleCard}>
                    <p>{ex.description}</p>
                    <pre style={styles.codeBlock}>{ex.code}</pre>
                  </div>
                ))}
              </div>
            ))}

            <input style={styles.input} placeholder="Topic Title *" value={topicTitle} onChange={e => setTopicTitle(e.target.value)} />
            <textarea style={styles.textarea} placeholder="Topic Content *" value={topicContent} onChange={e => setTopicContent(e.target.value)} />

            <h5 style={styles.sectionSubtitle}>Add Examples</h5>
            <input style={styles.input} placeholder="Example Description" value={exampleDescription} onChange={e => setExampleDescription(e.target.value)} />
            <textarea style={styles.textarea} placeholder="Example Code" value={exampleCode} onChange={e => setExampleCode(e.target.value)} />

            <div style={styles.navBtns}>
              <button style={styles.secondaryBtn} onClick={addExample}>Add Example</button>
              <button style={styles.primaryBtn} onClick={saveExamples}>Save Examples</button>
            </div>

            <div style={styles.navBtns}>
              <button style={styles.primaryBtn} onClick={addTopic}>Add Topic</button>
              <button style={styles.primaryBtn} onClick={() => { if (!topicTitle) return alert("Save topic first!"); navigate(`/upload-quiz/${name}/${topicTitle}`); }}>➕ Add Quiz</button>
            </div>

            <div style={styles.navBtns}>
              <button style={styles.secondaryBtn} onClick={() => setStep(2)}>← Back</button>
              <button style={styles.primaryBtn} disabled={topics.length === 0} onClick={() => setStep(4)}>Next → Finalize</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={styles.section}>
            <p><strong>Subject:</strong> {name}</p>
            <p><strong>Overview:</strong> {overview}</p>
            <p><strong>Why Learn:</strong> {whyLearn}</p>
            <p><strong>Purpose:</strong> {purpose}</p>
            <h4>Topics ({topics.length})</h4>
            {topics.map((t, idx) => (
              <div key={idx} style={styles.topicCard}>
                <h4>{t.title}</h4>
                <p>{t.content}</p>
              </div>
            ))}

            <div style={styles.navBtns}>
              <button style={styles.secondaryBtn} onClick={() => setStep(3)}>← Back</button>
              {!finalizeMode ? (
                <button style={styles.primaryBtn} onClick={finalizeSubject}>✅ Finalize Subject</button>
              ) : (
                <button style={styles.primaryBtn} onClick={saveSubject}>🚀 Commit & Upload</button>
              )}
            </div>
          </div>
        )}

        {showDialog && (
          <div style={styles.dialogOverlay}>
            <div style={styles.dialogBox}>Subject uploaded successfully! 🎉</div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #0c111b, #1b2430)", color: "#fff", fontFamily: "'Poppins', sans-serif", padding: "50px 20px", display: "flex", justifyContent: "center" },
  container: { background: "rgba(255,255,255,0.05)", borderRadius: "20px", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", padding: "40px", width: "100%", maxWidth: "900px", boxShadow: "0 10px 35px rgba(0,0,0,0.5)", position: "relative" },
  title: { fontSize: "2.5rem", fontWeight: "700", textAlign: "center", color: "#ffd700", marginBottom: "10px" },
  subtitle: { color: "#ccc", textAlign: "center", marginBottom: "25px" },
  progressContainer: { display: "flex", justifyContent: "space-between", marginBottom: "25px" },
  stepWrapper: { textAlign: "center", flex: 1 },
  stepCircle: { width: "40px", height: "40px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto 5px", color: "#fff", fontWeight: "bold" },
  stepLabel: { fontSize: "0.9rem", color: "#ccc" },
  message: { textAlign: "center", background: "rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px", marginBottom: "15px", color: "#90ee90" },
  section: { marginTop: "10px" },
  sectionTitle: { color: "#4cc9f0", fontWeight: "600", marginBottom: "10px" },
  sectionSubtitle: { color: "#ccc", marginTop: "10px" },
  input: { width: "100%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px", color: "#fff", padding: "12px", marginBottom: "12px" },
  textarea: { width: "100%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px", color: "#fff", padding: "12px", marginBottom: "12px", resize: "vertical" },
  topicCard: { background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "15px", marginBottom: "15px", boxShadow: "0 5px 20px rgba(0,0,0,0.4)" },
  exampleCard: { background: "rgba(255,255,255,0.06)", padding: "10px", borderRadius: "10px", marginTop: "5px" },
  codeBlock: { background: "#111827", color: "#a5b4fc", padding: "8px", borderRadius: "8px", fontSize: "0.85rem" },
  navBtns: { display: "flex", justifyContent: "space-between", marginTop: "15px", flexWrap: "wrap", gap: "10px" },
  primaryBtn: { background: "linear-gradient(90deg, #2563eb, #3b82f6)", border: "none", borderRadius: "30px", padding: "12px 24px", color: "#fff", fontWeight: "600", cursor: "pointer", transition: "0.3s", boxShadow: "0 5px 20px rgba(0,0,0,0.5)" },
  secondaryBtn: { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "25px", padding: "10px 20px", color: "#fff", fontWeight: "500", cursor: "pointer" },
  dialogOverlay: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 },
  dialogBox: { background: "#fff", color: "#000", padding: "30px 40px", borderRadius: "12px", textAlign: "center", fontWeight: "600", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" },
};

export default UploadSubject;
