import React, { useState, useRef, useEffect } from "react";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.reply || "Sorry, I couldn't understand that." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Error connecting to server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.chatContainer}>
        <h2 style={styles.header}>🤖 AI Tutor Chat</h2>

        <div style={styles.chatBox}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={msg.sender === "user" ? styles.userCard : styles.aiCard}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div style={styles.loadingText}>AI is typing...</div>}
          <div ref={chatEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.sendBtn}>Send</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #0c111b, #1b2430)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Poppins', sans-serif",
    padding: "20px",
  },
  chatContainer: {
    width: "100%",
    maxWidth: "600px",
    height: "80vh",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
  },
  header: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#ffd700",
    marginBottom: "20px",
    textAlign: "center",
    textShadow: "0 1px 8px rgba(0,0,0,0.4)",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "15px",
  },
  userCard: {
    alignSelf: "flex-end",
    background: "rgba(255,255,255,0.07)",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "15px 15px 0 15px",
    maxWidth: "75%",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
  },
  aiCard: {
    alignSelf: "flex-start",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "15px 15px 15px 0",
    maxWidth: "75%",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
  },
  loadingText: {
    fontStyle: "italic",
    color: "#ccc",
    fontSize: "0.9rem",
    paddingLeft: "10px",
  },
  inputArea: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "12px 15px",
    borderRadius: "25px",
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "1rem",
  },
  sendBtn: {
    background: "#ffd700",
    color: "#0c111b",
    border: "none",
    borderRadius: "25px",
    padding: "12px 20px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default ChatBot;
