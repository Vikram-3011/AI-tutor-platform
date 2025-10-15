import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // Needed to verify Supabase users if you want (optional)
import { createClient } from "@supabase/supabase-js";




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
// ✅ SUPABASE ROLE MANAGEMENT (Admin + SuperAdmin)
// ---------------------


// Initialize Supabase client securely using .env
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const userQuizSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  subjectName: { type: String, required: true },
  topicTitle: { type: String, required: true },
  score: { type: Number, required: true },
  answers: [
    {
      question: String,
      selectedAnswer: String,
      correctAnswer: String,
    },
  ],
  attemptedAt: { type: Date, default: Date.now },
});

userQuizSchema.index({ userEmail: 1, subjectName: 1, topicTitle: 1 }, { unique: true });

const UserQuiz = mongoose.model("UserQuiz", userQuizSchema);

// ---------------------
// Quiz Schema
// ---------------------
const quizSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  topicTitle: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      type: { type: String, enum: ["MCQ", "TF"], required: true },
      options: [String], // MCQ options (length 4), empty for TF
      answer: { type: String, required: true }, // Correct answer
    },
  ],
});

quizSchema.index({ subjectName: 1, topicTitle: 1 }, { unique: true });

const Quiz = mongoose.model("Quiz", quizSchema);



// ---------------------
// ✅ MyCourses Schema (Add this before using it)
// ---------------------
const myCourseSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  courses: [
    {
      subjectName: { type: String, required: true },
      status: { type: String, default: "unfinished" },
      addedAt: { type: Date, default: Date.now },
      finishedAt: { type: Date },
    },
  ],
});

const MyCourse = mongoose.model("MyCourse", myCourseSchema);

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

app.get("/api/subjects/id/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/subjects/:id", async (req, res) => {
  try {
    const deleted = await Subject.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Subject not found" });
    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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




// ✅ Verify if requester is Super Admin
const verifySuperAdmin = async (req, res, next) => {
  const { requesterEmail } = req.body;

  if (!requesterEmail)
    return res.status(400).json({ message: "Missing requesterEmail" });

  const { data: requester, error } = await supabase
    .from("admins")
    .select("*")
    .eq("email", requesterEmail)
    .single();

  if (error || !requester || !requester.is_super)
    return res.status(403).json({ message: "Access denied. Only super admin allowed." });

  next();
};

// ✅ Create Super Admin manually (only once)
app.post("/api/roles/create-superadmin", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Check if a super admin already exists
    const { data: existing } = await supabase
      .from("admins")
      .select("*")
      .eq("is_super", true)
      .maybeSingle();

    if (existing)
      return res.status(400).json({ message: "Super admin already exists." });

    // Insert the new super admin
    const { data, error } = await supabase
      .from("admins")
      .insert([{ name, email, is_admin: true, is_super: true }])
      .select();

    if (error) throw error;

    res.json({ message: "Super admin created successfully", user: data[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get All Users (for role management)
app.get("/api/roles/all", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .order("created_at");

    if (error) throw error;

    const users = data.map((u) => ({
      name: u.name,
      email: u.email,
      role: u.is_super ? "superadmin" : u.is_admin ? "admin" : "user",
    }));

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Promote to Admin (Super Admin only)
app.post("/api/roles/promote", verifySuperAdmin, async (req, res) => {
  try {
    const { targetEmail } = req.body;

    const { data: target, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", targetEmail)
      .single();

    if (error || !target)
      return res.status(404).json({ message: "User not found" });
    if (target.is_super)
      return res.status(400).json({ message: "Cannot promote a super admin" });
    if (target.is_admin)
      return res.status(400).json({ message: "User is already an admin" });

    const { error: updateErr } = await supabase
      .from("admins")
      .update({ is_admin: true })
      .eq("email", targetEmail);

    if (updateErr) throw updateErr;

    res.json({ message: `${targetEmail} promoted to Admin successfully.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Demote to User (Super Admin only)
app.post("/api/roles/demote", verifySuperAdmin, async (req, res) => {
  try {
    const { targetEmail } = req.body;

    const { data: target, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", targetEmail)
      .single();

    if (error || !target)
      return res.status(404).json({ message: "User not found" });
    if (target.is_super)
      return res.status(400).json({ message: "Cannot demote a super admin" });
    if (!target.is_admin)
      return res.status(400).json({ message: "Already a normal user" });

    const { error: updateErr } = await supabase
      .from("admins")
      .update({ is_admin: false })
      .eq("email", targetEmail);

    if (updateErr) throw updateErr;

    res.json({ message: `${targetEmail} demoted to User successfully.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Create or Verify Role on Login/Register
app.post("/api/roles/register-login", async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const { data: existing } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return res.json({ message: "Role verified", user: existing });
    }

    const { data, error } = await supabase
      .from("admins")
      .insert([{ email, name, is_admin: false, is_super: false }])
      .select();

    if (error) throw error;

    res.json({ message: "User added as normal user", user: data[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ Create/Update Quiz for a topic
app.post("/api/quiz", async (req, res) => {
  try {
    const { subjectName, topicTitle, questions } = req.body;
    if (!subjectName || !topicTitle || !questions || !questions.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const quiz = await Quiz.findOneAndUpdate(
      { subjectName, topicTitle },
      { questions },
      { upsert: true, new: true }
    );

    res.json({ message: "Quiz saved successfully", quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get Quiz for a topic
app.get("/api/quiz/:subjectName/:topicTitle", async (req, res) => {
  try {
    const { subjectName, topicTitle } = req.params;
    const quiz = await Quiz.findOne({ subjectName, topicTitle });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save Attempt
app.post("/api/quiz/submit", async (req, res) => {
  try {
    const { userEmail, subjectName, topicTitle, score, answers } = req.body;
    if (!userEmail || !subjectName || !topicTitle || score == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const attempt = await UserQuiz.findOneAndUpdate(
      { userEmail, subjectName, topicTitle },
      { score, answers, attemptedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ message: "Quiz submitted successfully", attempt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get User Attempt
app.get("/api/quiz/attempt/:userEmail/:subjectName/:topicTitle", async (req, res) => {
  try {
    const { userEmail, subjectName, topicTitle } = req.params;
    const attempt = await UserQuiz.findOne({ userEmail, subjectName, topicTitle });
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    res.json(attempt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all quiz progress for a user under a subject
app.get("/api/quiz/progress/:userEmail/:subjectName", async (req, res) => {
  try {
    const { userEmail, subjectName } = req.params;
    const attempts = await UserQuiz.find({ userEmail, subjectName });
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get subject performance summary for a user
app.get("/api/quiz/summary/:userEmail/:subjectName", async (req, res) => {
  try {
    const { userEmail, subjectName } = req.params;
    const attempts = await UserQuiz.find({ userEmail, subjectName });

    if (!attempts.length) {
      return res.json({ averageScore: 0, weakTopics: [], attempts: [] });
    }

    const total = attempts.reduce((sum, a) => sum + a.score, 0);
    const averageScore = (total / attempts.length).toFixed(1);

    // Topics below 50% are weak
    const weakTopics = attempts
      .filter((a) => a.score < 50)
      .map((a) => ({ title: a.topicTitle, score: a.score }));

    res.json({ averageScore, weakTopics, attempts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// ---------------------
// CHATBOT ROUTE
// ---------------------
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "Message is required" });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta2/models/${process.env.GEMINI_MODEL}:generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: { text: message },
          temperature: 0.7,
          max_output_tokens: 500,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return res.status(500).json({ reply: "AI service error" });
    }

    const data = await response.json();

    // ✅ Handle different response structures
    let aiReply = data?.candidates?.[0]?.content; // old structure
    if (!aiReply && data?.output?.length) {
      aiReply = data.output[0]?.content || data.output[0]?.text; // new Gemini/PaLM structure
    }

    if (!aiReply) {
      console.error("Gemini response invalid:", data);
      return res.json({ reply: "Sorry, AI could not generate a response." });
    }

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ reply: "Error connecting to AI service" });
  }
});


// Add subject to user's MyCourses
app.post("/api/mycourses/add", async (req, res) => {
  try {
    const { userEmail, subjectName } = req.body;
    if (!userEmail || !subjectName)
      return res.status(400).json({ message: "Missing required fields" });

    let userCourses = await MyCourse.findOne({ userEmail });
    if (!userCourses) {
      userCourses = new MyCourse({ userEmail, courses: [{ subjectName }] });
    } else {
      const exists = userCourses.courses.some((c) => c.subjectName === subjectName);
      if (exists) return res.status(400).json({ message: "Course already added" });
      userCourses.courses.push({ subjectName });
    }

    await userCourses.save();
    res.json({ message: "Course added successfully", courses: userCourses.courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Mark a course as finished
app.post("/api/mycourses/finish", async (req, res) => {
  try {
    const { userEmail, subjectName } = req.body;
    const userCourses = await MyCourse.findOne({ userEmail });
    if (!userCourses)
      return res.status(404).json({ message: "User has no courses" });

    const course = userCourses.courses.find((c) => c.subjectName === subjectName);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.status = "finished";
    course.finishedAt = new Date();

    await userCourses.save();
    res.json({ message: "Course marked as finished", courses: userCourses.courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get user's all courses (unfinished + finished)
app.get("/api/mycourses/:userEmail", async (req, res) => {
  try {
    const { userEmail } = req.params;
    const userCourses = await MyCourse.findOne({ userEmail });

    if (!userCourses) {
      return res.json({ courses: [] });
    }

    // Return all courses, not just unfinished
    res.json({ courses: userCourses.courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
