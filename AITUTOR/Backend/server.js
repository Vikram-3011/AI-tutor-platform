import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // Needed to verify Supabase users if you want (optional)

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------------------
// Subject Schema
// ---------------------
const subjectSchema = new mongoose.Schema({
  name: String,
  icon: String,
  introduction: {
    overview: String,
    why_learn: String,
    purpose: String,
  },
  topics: [
    {
      title: String,
      content: String,
      examples: [
        {
          description: String,
          code: String,
        },
      ],
    },
  ],
});

const Subject = mongoose.model("Subject", subjectSchema);

// ---------------------
// User Schema
// ---------------------
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, default: "" },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" }, // base64 image string
  dob: { type: String, default: "" }, // Date of Birth (string for simplicity)
  phone: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// ---------------------
// ROUTES
// ---------------------
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Subject Routes
app.get("/api/subjects", async (req, res) => {
  try {
    const subjects = await Subject.find({}, "name");
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/all-subjects", async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/subjects/:id", async (req, res) => {
  try {
    const deleted = await Subject.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Subject not found" });
    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/subjects/:id", async (req, res) => {
  try {
    const { name, icon, introduction, topics } = req.body;
    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, icon, introduction, topics },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Subject not found" });
    res.json({ message: "Subject updated successfully", updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/subjects/:name", async (req, res) => {
  try {
    const subject = await Subject.findOne({ name: req.params.name });
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/subjects", async (req, res) => {
  try {
    const { name, introduction, topics, icon } = req.body;
    if (!name || !introduction || !topics) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Subject.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Subject already exists" });
    }

    const newSubject = new Subject({ name, introduction, topics, icon });
    await newSubject.save();
    res.status(201).json({ message: "Subject uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------
// ✅ USER PROFILE ROUTES
// ---------------------

// ✅ Auto-create profile on sign in if not found
app.post("/api/create-profile", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
      await user.save();
      console.log("🟢 Profile created for:", email);
    } else {
      console.log("✅ Profile already exists for:", email);
    }

    res.json({ message: "Profile verified or created", user });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: "Failed to create profile" });
  }
});

// ✅ Fetch profile by email
app.get("/api/profile/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const profile = await User.findOne({ email });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// ✅ Update profile by email
// ✅ Update profile by email (UPDATED)
app.put("/api/profile/:email", async (req, res) => {
  const { email } = req.params;
  const { name, bio, avatar, dob, phone } = req.body;

  try {
    const updatedProfile = await User.findOneAndUpdate(
      { email },
      { $set: { name, bio, avatar, dob, phone } },
      { new: true }
    );

    if (!updatedProfile)
      return res.status(404).json({ message: "Profile not found" });

    res.json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});



// ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
