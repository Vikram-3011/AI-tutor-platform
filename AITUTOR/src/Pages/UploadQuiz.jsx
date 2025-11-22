import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

function UploadQuiz() {
  const navigate = useNavigate();

  // --- State for Selection Flow ---
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(""); // Stores Subject Name
  const [selectedTopic, setSelectedTopic] = useState("");     // Stores Topic Title
  const [step, setStep] = useState(1); // 1 = Select Subject, 2 = Select Topic, 3 = Edit Quiz

  // --- State for Quiz Editing ---
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("MCQ");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  // 1. Fetch All Subjects on Mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/all-subjects`)
      .then((res) => res.json())
      .then((data) => setSubjects(data))
      .catch((err) => console.error("Error loading subjects:", err));
  }, []);

  // 2. Handle Subject Selection
  const handleSubjectChange = async (e) => {
    const subjectName = e.target.value;
    setSelectedSubject(subjectName);
    
    if (subjectName) {
      try {
        // Fetch specific subject details to get the topics list
        const res = await fetch(`${API_BASE_URL}/api/subjects/${subjectName}`);
        const data = await res.json();
        setTopics(data.topics || []);
        setStep(2); // Move to Topic Selection
      } catch (err) {
        setMessage("❌ Error fetching topics.");
      }
    }
  };

  // 3. Handle Topic Selection
  const handleTopicClick = async (topicTitle) => {
    setSelectedTopic(topicTitle);
    setStep(3); // Move to Quiz Editor
    setMessage(""); // Clear previous messages

    // Try to fetch existing quiz for this topic (so we don't overwrite blindly)
    try {
      const res = await fetch(`${API_BASE_URL}/api/quiz/${selectedSubject}/${topicTitle}`);
      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
          setMessage("ℹ️ Loaded existing questions.");
        }
      } else {
        setQuestions([]); // No quiz exists yet, start fresh
      }
    } catch (err) {
      setQuestions([]);
    }
  };

  // 4. Add Question Logic
  const addQuestion = () => {
    if (!question || !answer) {
      return setMessage("⚠️ Please fill question and correct answer.");
    }
    if (type === "MCQ" && options.some((opt) => !opt)) {
      return setMessage("⚠️ Please fill all 4 options for MCQ.");
    }

    const newQ = { question, type, options: type === "MCQ" ? options : [], answer };
    setQuestions([...questions, newQ]);
    
    // Reset inputs
    setQuestion("");
    setOptions(["", "", "", ""]);
    setAnswer("");
    setMessage("✅ Question added!");
  };

  // 5. Save Quiz Logic
  const saveQuiz = async () => {
    if (questions.length === 0) {
      return setMessage("⚠️ Add at least one question before saving.");
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subjectName: selectedSubject, 
          topicTitle: selectedTopic, 
          questions 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("✅ Quiz saved successfully!");
      
      // Optional: Navigate back or clear state
      setTimeout(() => {
        setMessage("");
        // If you want to go back to topic list after save:
        // setStep(2); 
      }, 2000);
      
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  // --- RENDER HELPERS ---

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        
        {/* HEADER */}
        <h2 style={styles.title}>
            {step === 3 ? "Add Quiz Questions" : "Quiz Manager"}
        </h2>
        
        {/* Breadcrumb / Subtitle */}
        <p style={styles.subtitle}>
            {step === 1 && "Select a Subject to begin"}
            {step === 2 && `${selectedSubject} → Select a Topic`}
            {step === 3 && `${selectedSubject} → ${selectedTopic}`}
        </p>

        {/* Message Banner */}
        {message && (
          <p style={{
              ...styles.message,
              color: message.includes("✅") ? "#22c55e" : message.includes("⚠️") ? "#facc15" : "#ef4444"
          }}>
            {message}
          </p>
        )}

        {/* STEP 1: SELECT SUBJECT */}
        {step === 1 && (
            <div>
                <label style={styles.label}>Choose Subject:</label>
                <select 
                    style={styles.select} 
                    onChange={handleSubjectChange} 
                    value={selectedSubject}
                >
                    <option value="">-- Select Subject --</option>
                    {subjects.map((sub) => (
                        <option key={sub._id} value={sub.name}>{sub.name}</option>
                    ))}
                </select>
            </div>
        )}

        {/* STEP 2: SELECT TOPIC */}
        {step === 2 && (
            <div>
                <button style={styles.backBtn} onClick={() => { setStep(1); setSelectedSubject(""); }}>
                    ← Back to Subjects
                </button>
                
                <div style={styles.topicList}>
                    {topics.length === 0 ? (
                        <p style={{textAlign: "center", color: "#64748b"}}>No topics found for this subject.</p>
                    ) : (
                        topics.map((t, index) => (
                            <div 
                                key={index} 
                                style={styles.topicItem} 
                                onClick={() => handleTopicClick(t.title)}
                            >
                                <span>{index + 1}. {t.title}</span>
                                <span style={styles.arrow}>➜</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {/* STEP 3: ADD/EDIT QUIZ */}
        {step === 3 && (
            <div>
                <button style={styles.backBtn} onClick={() => setStep(2)}>
                    ← Back to Topics
                </button>

                {/* Form Inputs */}
                <input
                    style={styles.input}
                    placeholder="Enter question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />

                <select
                    style={styles.select}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="MCQ">Multiple Choice (MCQ)</option>
                    <option value="TF">True / False</option>
                </select>

                {type === "MCQ" && (
                    <>
                    {options.map((opt, i) => (
                        <input
                            key={i}
                            style={styles.input}
                            placeholder={`Option ${i + 1}`}
                            value={opt}
                            onChange={(e) =>
                                setOptions(options.map((o, idx) => (idx === i ? e.target.value : o)))
                            }
                        />
                    ))}
                    </>
                )}

                <input
                    style={styles.input}
                    placeholder="Enter correct answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />

                {/* Action Buttons */}
                <div style={styles.btnRow}>
                    <button style={styles.btnAdd} onClick={addQuestion}>➕ Add Question</button>
                    <button style={styles.btnSave} onClick={saveQuiz}>💾 Save Quiz</button>
                </div>

                {/* Preview List */}
                <div style={styles.previewSection}>
                    <h4 style={styles.previewTitle}>Added Questions ({questions.length})</h4>
                    {questions.length === 0 ? (
                        <p style={{ color: "#94a3b8" }}>No questions added yet.</p>
                    ) : (
                        <ul style={styles.questionList}>
                            {questions.map((q, i) => (
                                <li key={i} style={styles.questionItem}>
                                    <div>
                                        <strong>{i + 1}.</strong> {q.question}
                                    </div>
                                    <span style={styles.typeTag}>{q.type}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

/* ================================
   💅 CSS in JS Styles
================================ */
const styles = {
  page: {
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    background: "#1e293b",
    color: "#f8fafc",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    width: "100%",
    maxWidth: "600px",
    minHeight: "400px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "5px",
    color: "#22d3ee",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "16px",
    marginBottom: "25px",
    textAlign: "center",
    color: "#94a3b8",
  },
  message: {
    textAlign: "center",
    marginBottom: "20px",
    fontWeight: "600",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#cbd5e1",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: "15px",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: "15px",
    outline: "none",
    cursor: "pointer",
  },
  // Topic List Styles
  topicList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
  },
  topicItem: {
    background: "#0f172a",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #334155",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.2s ease",
    color: "#e2e8f0",
  },
  arrow: {
    color: "#22d3ee",
    fontWeight: "bold",
  },
  backBtn: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    marginBottom: "15px",
    fontSize: "14px",
    padding: "0",
    textDecoration: "underline",
  },
  // Button Styles
  btnRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    flexWrap: "wrap",
    gap: "10px",
  },
  btnAdd: {
    flex: 1,
    padding: "12px",
    background: "#38bdf8",
    color: "#0f172a",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
  },
  btnSave: {
    flex: 1,
    padding: "12px",
    background: "#22c55e",
    color: "#0f172a",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
  },
  // Preview Styles
  previewSection: {
    marginTop: "30px",
    borderTop: "1px solid #334155",
    paddingTop: "20px",
  },
  previewTitle: {
    marginBottom: "10px",
    color: "#22d3ee",
    fontWeight: "600",
  },
  questionList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  questionItem: {
    background: "#0f172a",
    marginBottom: "10px",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeTag: {
    background: "#22d3ee",
    color: "#0f172a",
    borderRadius: "8px",
    padding: "2px 8px",
    fontSize: "12px",
    fontWeight: "600",
  },
};

export default UploadQuiz;