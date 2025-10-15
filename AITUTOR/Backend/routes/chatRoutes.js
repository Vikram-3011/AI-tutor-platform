// backend/routes/chatRoutes.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Read API key from env (set GEMINI_API_KEY in backend .env)
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY is not set. Set it in your backend .env file.");
}

// Replace modelName with the model you have access to.
// If you want Gemini Flash 1.5, name may be "gemini-1.5-flash" (check Google docs).
// For a stable public example you can try "text-bison-001" (if your account permits).
const MODEL_NAME = process.env.GEMINI_MODEL || "models/text-bison-001"; // change if you have gemini model

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: "Server missing GEMINI_API_KEY" });

    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message field (string) required" });
    }

    // Build REST endpoint URL for Generative Language API v1beta2
    // IMPORTANT: if your model is a Gemini model available through AI Studio, the endpoint or model
    // name may differ. Check docs. Replace MODEL_NAME above accordingly.
    const url = `https://generativelanguage.googleapis.com/v1beta2/${MODEL_NAME}:generateText?key=${API_KEY}`;

    const body = {
      prompt: {
        text: message
      },
      // optional: tune parameters here
      temperature: 0.2,
      maxOutputTokens: 512
    };

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await r.json();

    if (!r.ok) {
      console.error("Generative API error:", json);
      return res.status(500).json({ error: "Generative API error", details: json });
    }

    // Path to the generated text may vary. This is the typical shape:
    // json.candidates[0].content or json.output[0].content[0].text depending on API version
    // We'll try a few common paths to extract something.
    let reply = "";
    if (json.candidates && json.candidates[0] && json.candidates[0].content) {
      // content may be array of objects or a string
      const c = json.candidates[0].content;
      if (Array.isArray(c)) {
        reply = c.map(part => part.text || part).join("");
      } else {
        reply = c.text || String(c);
      }
    } else if (json.output && json.output[0] && json.output[0].content) {
      // another possible shape
      reply = (json.output[0].content.map(p => p.text || p).join("")).trim();
    } else if (json.generatedText) {
      reply = json.generatedText;
    } else if (json.reply) {
      reply = json.reply;
    } else {
      // fallback: stringify entire response
      reply = JSON.stringify(json);
    }

    res.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;
