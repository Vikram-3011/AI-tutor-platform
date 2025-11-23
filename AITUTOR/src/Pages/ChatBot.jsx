import React, { useState, useRef, useEffect } from "react";

// Define your backend URL (or import from config if you have one)
const API_BASE_URL = "http://localhost:5000";

function ChatBot() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I am your AI assistant. Ask me anything about your subjects!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to latest message automatically
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // 1. Add User Message to UI immediately
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      // 2. Send request to YOUR Backend (Secure)
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      // 3. Add AI Response to UI
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.reply || "I couldn't generate a response." },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { 
          sender: "ai", 
          text: " Sorry, I'm having trouble connecting to the server right now.Try again later. " 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>✨ AI Chat Bot</h2>

        <div style={styles.chatBox}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={msg.sender === "user" ? styles.userMsg : styles.aiMsg}
            >
              {/* Render text with line breaks preserved */}
              {msg.text.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          ))}

          {loading && (
            <div style={styles.aiMsg}>
               <span style={styles.typingDot}>●</span>
               <span style={styles.typingDot}>●</span>
               <span style={styles.typingDot}>●</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            type="text"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={styles.input}
            disabled={loading}
          />
          <button 
            onClick={sendMessage} 
            style={{...styles.button, opacity: loading ? 0.7 : 1}}
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 🔥 Explore Page Theme Styles
const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "radial-gradient(circle at 20% 20%, #0f172a, #020617 70%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    fontFamily: "'Poppins', sans-serif",
    color: "#fff",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "800px",
    height: "80vh",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
  },

  title: {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: "600",
    marginBottom: "20px",
    background: "linear-gradient(90deg, #2563eb, #60a5fa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  chatBox: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    padding: "15px",
    scrollBehavior: "smooth",
  },

  userMsg: {
    alignSelf: "flex-end",
    background: "linear-gradient(90deg, #2563eb, #3b82f6)",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "18px 18px 0 18px",
    maxWidth: "80%",
    boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)",
    lineHeight: "1.5",
    fontSize: "0.95rem",
  },

  aiMsg: {
    alignSelf: "flex-start",
    background: "rgba(255,255,255,0.1)",
    color: "#e2e8f0",
    padding: "12px 18px",
    borderRadius: "18px 18px 18px 0",
    maxWidth: "80%",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.05)",
    lineHeight: "1.5",
    fontSize: "0.95rem",
  },

  inputArea: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
    background: "rgba(0,0,0,0.2)",
    padding: "10px",
    borderRadius: "30px",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  input: {
    flex: 1,
    padding: "12px 20px",
    borderRadius: "25px",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#fff",
    fontSize: "1rem",
  },

  button: {
    padding: "12px 24px",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(90deg, #72a6efff, #0947c3ff)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s",
    boxShadow: "0 4px 12px rgba(14, 65, 174, 0.3)",
  },

  typingDot: {
    animation: "blink 1.4s infinite both",
    fontSize: "1.2rem",
    marginLeft: "2px",
    marginRight: "2px",
  }
};

// Inject simple keyframe for typing animation
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes blink {
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
}
.typingDot:nth-child(2) { animation-delay: 0.2s; }
.typingDot:nth-child(3) { animation-delay: 0.4s; }
`;
document.head.appendChild(styleSheet);

export default ChatBot;