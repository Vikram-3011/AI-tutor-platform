import React, { useState, useRef, useEffect } from "react";

// Define your backend URL
const API_BASE_URL = "http://localhost:5000";

function ChatBot() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I am your AI assistant. Ask me anything about your subjects!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.reply || "I couldn't generate a response." },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, I'm having trouble connecting right now." },
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
              {msg.text.split("\n").map((line, i) => (
                <span key={i}>{line}<br /></span>
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

        {/* Input Area - Visual "Pill" Container */}
        <div style={styles.inputArea}>
          <input
            className="chat-input" // ✅ Applies the CSS fix below
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

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "radial-gradient(circle at 20% 20%, #0f172a, #020617 70%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
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
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    textAlign: "center",
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom: "15px",
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
    padding: "10px",
    scrollBehavior: "smooth",
    marginBottom: "10px",
  },
  userMsg: {
    alignSelf: "flex-end",
    background: "linear-gradient(90deg, #2563eb, #3b82f6)",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "18px 18px 0 18px",
    maxWidth: "85%",
    boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)",
    lineHeight: "1.5",
    fontSize: "0.95rem",
    wordBreak: "break-word",
  },
  aiMsg: {
    alignSelf: "flex-start",
    background: "rgba(255,255,255,0.1)",
    color: "#e2e8f0",
    padding: "12px 18px",
    borderRadius: "18px 18px 18px 0",
    maxWidth: "85%",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.05)",
    lineHeight: "1.5",
    fontSize: "0.95rem",
    wordBreak: "break-word",
  },

  /* ✅ FIXED CONTAINER STYLE */
  inputArea: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(255,255,255,0.08)", // The visual "box" background
    padding: "6px 6px 6px 20px", // Padding for text
    borderRadius: "50px",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },

  /* ✅ FIXED INPUT STYLE - Completely Transparent */
  input: {
    flex: 1,
    padding: "10px 0",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#fff",
    fontSize: "1rem",
    minWidth: "50px",
    appearance: "none",
    boxShadow: "none",
  },

  button: {
    padding: "10px 24px",
    borderRadius: "30px",
    border: "none",
    background: "linear-gradient(90deg, #72a6efff, #0947c3ff)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s",
    boxShadow: "0 4px 12px rgba(14, 65, 174, 0.3)",
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  typingDot: {
    animation: "blink 1.4s infinite both",
    fontSize: "1.2rem",
    marginLeft: "2px",
    marginRight: "2px",
  }
};

// ✅ Inject CSS to Force Override Browser Defaults
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes blink {
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
}
.typingDot:nth-child(2) { animation-delay: 0.2s; }
.typingDot:nth-child(3) { animation-delay: 0.4s; }

/* 🚀 CRITICAL FIX: Removes Blue Box on Focus */
.chat-input:focus {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
  background: transparent !important;
}

/* Prevent Autofill White Background */
input.chat-input:-webkit-autofill,
input.chat-input:-webkit-autofill:hover, 
input.chat-input:-webkit-autofill:focus, 
input.chat-input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #242b3d inset !important; /* Dark background */
    -webkit-text-fill-color: white !important;
    transition: background-color 5000s ease-in-out 0s;
}
`;
document.head.appendChild(styleSheet);

export default ChatBot;