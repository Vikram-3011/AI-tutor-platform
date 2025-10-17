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
      "☕ Java is a high-level, object-oriented programming language developed by Sun Microsystems. It is platform-independent thanks to the JVM (Java Virtual Machine).",
    "about python":
      "🐍 Python is a versatile, beginner-friendly programming language known for its readability and wide use in AI, web development, and automation.",
    "about html":
      "🌐 HTML (HyperText Markup Language) is the standard language for creating web pages and structuring web content.",
    "about css":
      "🎨 CSS (Cascading Style Sheets) is used to style and design web pages — controlling colors, layouts, and fonts.",
    "about javascript":
      "⚡ JavaScript is a scripting language used to make web pages interactive. It runs in browsers and on servers using Node.js.",
    "about c++":
      "💻 C++ is a powerful programming language often used for system software, game engines, and performance-critical applications.",
    "about computer":
      "🖥️ A computer is an electronic device that processes data according to a set of instructions (programs) to produce meaningful output.",
    "about ai":
      "🤖 Artificial Intelligence (AI) enables machines to mimic human intelligence, such as learning, reasoning, and decision-making.",
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim().toLowerCase();
    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    // Simulate AI typing delay
    setTimeout(() => {
      if (responses[userMessage]) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: responses[userMessage] },
        ]);
        setLoading(false);
      } else {
        // Unknown input → stays in loading state forever
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "" },
        ]);
      }
    }, 1000);
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
              {msg.text || (loading && idx === messages.length - 1 ? "AI is typing..." : "")}
            </div>
          ))}

          {loading && (
            <div style={styles.loadingText}></div>
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
          <button onClick={sendMessage} style={styles.sendBtn}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// 💅 Styling (same as before)
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
