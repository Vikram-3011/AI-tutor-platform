import React, { useState, useRef, useEffect } from "react";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Hardcoded responses
  const responses = {
    "about java":
      "☕ Java is a high-level, object-oriented language known for platform independence.",
    "about python":
      "🐍 Python is a powerful, beginner-friendly language widely used in AI and automation.",
    "about html":
      "🌐 HTML structures web pages and defines website content.",
    "about css":
      "🎨 CSS styles and designs websites — layouts, colors, animations.",
    "about javascript":
      "⚡ JavaScript makes websites interactive and dynamic.",
    "about c++":
      "💻 C++ is used for high-performance apps, game engines, and system software.",
    "about ai":
      "🤖 AI allows machines to learn and make decisions similar to humans.",
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = input.trim().toLowerCase();
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            responses[userMsg] ||
            "I'm still learning! Please try asking something like 'about java'.",
        },
      ]);
      setLoading(false);
    }, 800);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}> AI Chat Bot</h2>

        <div style={styles.chatBox}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={msg.sender === "user" ? styles.userMsg : styles.aiMsg}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div style={styles.aiMsg}>AI is typing…</div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            type="text"
            placeholder="Ask something like 'about java'..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.button}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// 🔥 Styling copied to match Explore page theme
const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    background: "radial-gradient(circle at 20% 20%, #0f172a, #020617 70%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    fontFamily: "'Poppins', sans-serif",
    color: "#fff",
  },

  card: {
    width: "100%",
    maxWidth: "700px",
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
    gap: "12px",
    padding: "10px",
  },

  userMsg: {
    alignSelf: "flex-end",
    background: "rgba(59,130,246,0.4)",
    padding: "12px 15px",
    borderRadius: "15px 15px 0 15px",
    maxWidth: "75%",
    backdropFilter: "blur(5px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  aiMsg: {
    alignSelf: "flex-start",
    background: "rgba(255,255,255,0.12)",
    padding: "12px 15px",
    borderRadius: "15px 15px 15px 0",
    maxWidth: "75%",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  inputArea: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
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

  button: {
    padding: "12px 20px",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(90deg, #2563eb, #3b82f6)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default ChatBot;
