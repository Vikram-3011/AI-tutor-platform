import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define the schema for subjects
const subjectSchema = new mongoose.Schema({
  name: String,
  introduction: {
    overview: String,
    why_learn: String,
    purpose: String,
  },
  topics: [
    {
      title: String,
      content: String,
    },
  ],
});

const Subject = mongoose.model("Subject", subjectSchema);

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Fetch all subjects (only names)
app.get("/api/subjects", async (req, res) => {
  try {
    const subjects = await Subject.find({}, "name");
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch a single subject by name
app.get("/api/subjects/:name", async (req, res) => {
  try {
    const subject = await Subject.findOne({ name: req.params.name });
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
