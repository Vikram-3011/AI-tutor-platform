import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VITE_API_BASE_URL = "https://ai-tutor-khaki.vercel.app/";

function UploadQuiz() {
  const navigate = useNavigate();

  // --- State for Selection Flow ---
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
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
    fetch(`${VITE_API_BASE_URL}/api/all-subjects`)
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
        const res = await fetch(`${VITE_API_BASE_URL}/api/subjects/${subjectName}`);
        const data = await res.json();
        setTopics(data.topics || []);
        setStep(2);
      } catch (err) {
        setMessage(" Error fetching topics.");
      }
    }
  };

  // 3. Handle Topic Selection
  const handleTopicClick = async (topicTitle) => {
    setSelectedTopic(topicTitle);
    setStep(3);
    setMessage("");

    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/quiz/${selectedSubject}/${topicTitle}`);
      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
          setMessage(" Loaded existing questions.");
        }
      } else {
        setQuestions([]);
      }
    } catch (err) {
      setQuestions([]);
    }
  };

  // 4. Add Question Logic
  const addQuestion = () => {
    if (!question || !answer) {
      return setMessage(" Please fill question and correct answer.");
    }
    if (type === "MCQ" && options.some((opt) => !opt)) {
      return setMessage(" Please fill all 4 options for MCQ.");
    }

    const newQ = { question, type, options: type === "MCQ" ? options : [], answer };
    setQuestions([...questions, newQ]);

    setQuestion("");
    setOptions(["", "", "", ""]);
    setAnswer("");
    setMessage(" Question added!");
  };

  // 5. Save Quiz Logic
  const saveQuiz = async () => {
    if (questions.length === 0) {
      return setMessage("⚠️ Add at least one question before saving.");
    }

    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectName: selectedSubject,
          topicTitle: selectedTopic,
          questions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage(" Quiz saved successfully!");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (err) {
      setMessage(` ${err.message}`);
    }
  };

  return (
    <div style={styles.page}>
      
      {/* HEADER SECTION */}
      <header style={styles.header}>
        <h1 style={styles.title}>
           {step === 3 ? "Quiz Manager" : "Upload Quiz"}
        </h1>
        <p style={styles.subtitle}>
          {step === 1 && "Select a Subject to begin adding questions"}
          {step === 2 && `${selectedSubject} → Select a Topic`}
          {step === 3 && `Editing: ${selectedSubject} / ${selectedTopic}`}
        </p>
      </header>

      {/* Message Banner */}
      {message && (
        <div style={{
           ...styles.messageBox,
           borderColor: message.includes("✅") ? "#22c55e" : message.includes("⚠️") ? "#facc15" : "#ef4444"
        }}>
           <span style={{ color: message.includes("✅") ? "#86efac" : message.includes("⚠️") ? "#fde047" : "#fca5a5" }}>
             {message}
           </span>
        </div>
      )}

      {/* STEP 1: SELECT SUBJECT */}
      {step === 1 && (
        <div style={styles.glassContainer}>
            <label style={styles.label}>Choose Subject:</label>
            <div style={styles.selectWrapper}>
                <select
                    style={styles.select}
                    onChange={handleSubjectChange}
                    value={selectedSubject}
                >
                    <option value="" style={{color: '#000'}}>-- Select Subject --</option>
                    {subjects.map((sub) => (
                    <option key={sub._id} value={sub.name} style={{color: '#000'}}>{sub.name}</option>
                    ))}
                </select>
            </div>
        </div>
      )}

      {/* STEP 2: SELECT TOPIC (TABLE LIST VIEW) */}
      {step === 2 && (
        <div style={styles.fullWidthContainer}>
            <button style={styles.backBtn} onClick={() => { setStep(1); setSelectedSubject(""); }}>
                ← Back to Subjects
            </button>

            <div style={styles.glassTableContainer}>
                {/* Table Header */}
                <div style={styles.tableHeader}>
                    <span style={{width: '60px', textAlign:'center'}}>No.</span>
                    <span style={{flex: 1, paddingLeft: 20}}>Topic Title</span>
                    <span style={{width: '100px', textAlign:'right'}}>Action</span>
                </div>

                {/* Table Body */}
                <div style={styles.listContainer}>
                    {topics.length === 0 ? (
                        <p style={styles.noDataText}>No topics found for this subject.</p>
                    ) : (
                        topics.map((t, index) => (
                            <div
                                key={index}
                                style={styles.listItem}
                                onClick={() => handleTopicClick(t.title)}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                            >
                                <span style={styles.listIndex}>{index + 1}</span>
                                <span style={styles.listTitle}>{t.title}</span>
                                <span style={styles.listAction}>Select ➜</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      )}

      {/* STEP 3: ADD/EDIT QUIZ */}
      {step === 3 && (
        <div style={styles.glassContainer}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 20}}>
            <button style={styles.backBtn} onClick={() => setStep(2)}>
                ← Back to Topics
            </button>
            <span style={styles.counterBadge}>{questions.length} Questions Added</span>
          </div>

          <input
            style={styles.input}
            placeholder="Enter question text..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <select
            style={styles.select}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="MCQ" style={{color: '#000'}}>Multiple Choice (MCQ)</option>
            <option value="TF" style={{color: '#000'}}>True / False</option>
          </select>

          {type === "MCQ" && (
            <div style={styles.optionsGrid}>
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
            </div>
          )}

          <input
            style={styles.input}
            placeholder="Enter the correct answer (matches option exactly)"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <div style={styles.btnRow}>
            <button style={styles.btnAdd} onClick={addQuestion}>+ Add Question</button>
            <button style={styles.btnSave} onClick={saveQuiz}> Save Quiz</button>
          </div>

          <div style={styles.previewSection}>
            <h4 style={styles.previewTitle}>Preview Questions</h4>
            {questions.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign:'center', fontStyle:'italic' }}>No questions added yet.</p>
            ) : (
              <ul style={styles.questionList}>
                {questions.map((q, i) => (
                  <li key={i} style={styles.questionItem}>
                    <div>
                      <strong style={{color:'#93c5fd'}}>Q{i + 1}:</strong> {q.question}
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
  );
}

/* ================================
    CSS in JS Styles (Matches Explore)
================================ */
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
  
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.8rem",
    fontWeight: "700",
    background: "linear-gradient(90deg, #2563eb, #60a5fa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#cbd5e1",
  },

  /* Containers */
  fullWidthContainer: {
    width: "100%",
    maxWidth: "800px",
  },
  
  glassContainer: {
    width: "100%",
    maxWidth: "800px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
    padding: "40px",
  },

  /* --- NEW TABLE LIST STYLES (STEP 2) --- */
  glassTableContainer: {
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(20px)",
      borderRadius: "20px",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
  },
  tableHeader: {
      display: 'flex',
      padding: '10px 15px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      marginBottom: '10px',
      fontWeight: '600',
      color: '#93c5fd',
      fontSize: '0.95rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
  },
  listContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
  },
  listItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      borderRadius: '12px',
      background: "rgba(255,255,255,0.03)", // Very subtle background
      border: '1px solid rgba(255,255,255,0.05)',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
  },
  listIndex: {
      width: '60px',
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#cbd5e1',
      fontSize: '1rem',
  },
  listTitle: {
      flex: 1,
      paddingLeft: '20px',
      fontSize: '1rem',
      color: '#fff',
      fontWeight: '500'
  },
  listAction: {
      width: '100px',
      textAlign: 'right',
      color: '#3b82f6',
      fontSize: '0.9rem',
      fontWeight: '600'
  },

  /* Inputs & Forms */
  label: {
    display: "block",
    marginBottom: "10px",
    color: "#93c5fd",
    fontWeight: "600",
    fontSize: "1.1rem",
  },
  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.3)",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
  },
  selectWrapper: { position: 'relative' },
  select: {
    width: "100%",
    padding: "14px",
    marginBottom: "20px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.3)",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  optionsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginBottom: '10px'
  },

  /* Buttons */
  backBtn: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    marginBottom: "20px",
    fontSize: "1rem",
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: "color 0.2s",
  },
  btnRow: {
    display: "flex",
    gap: "15px",
    marginTop: "10px",
  },
  btnAdd: {
    flex: 1,
    padding: "12px",
    background: "linear-gradient(90deg, #3b82f6, #2563eb)",
    color: "#fff",
    fontWeight: "600",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.2s",
    boxShadow: "0 4px 15px rgba(37, 99, 235, 0.4)",
  },
  btnSave: {
    flex: 1,
    padding: "12px",
    background: "linear-gradient(90deg, #10b981, #059669)",
    color: "#fff",
    fontWeight: "600",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.2s",
    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
  },

  /* Feedback & Preview */
  messageBox: {
      padding: "10px 20px",
      borderRadius: "30px",
      border: "1px solid",
      background: "rgba(0,0,0,0.3)",
      marginBottom: "30px",
      textAlign: "center",
  },
  previewSection: {
    marginTop: "40px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "20px",
  },
  previewTitle: {
    marginBottom: "15px",
    color: "#93c5fd",
    fontWeight: "600",
    fontSize: "1.1rem",
  },
  questionList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  questionItem: {
    background: "rgba(255,255,255,0.03)",
    marginBottom: "10px",
    padding: "15px",
    borderRadius: "10px",
    fontSize: "0.95rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  typeTag: {
    background: "rgba(34, 211, 238, 0.2)",
    color: "#67e8f9",
    borderRadius: "8px",
    padding: "4px 10px",
    fontSize: "0.8rem",
    fontWeight: "600",
    border: "1px solid rgba(34, 211, 238, 0.3)",
  },
  counterBadge: {
      background: "rgba(255,255,255,0.1)",
      padding: "5px 12px",
      borderRadius: "20px",
      fontSize: "0.85rem",
      color: "#cbd5e1"
  },
  noDataText: {
      textAlign: "center",
      color: "#64748b",
      gridColumn: "1 / -1",
      fontSize: "1.1rem",
      marginTop: "20px"
  }
};

export default UploadQuiz;