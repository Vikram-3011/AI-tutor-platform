import React from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const courses = [
    { id: 1, title: "React Basics", description: "Learn the basics of React.js" },
    { id: 2, title: "Vite Setup", description: "Set up a modern React project with Vite" },
    { id: 3, title: "Routing in React", description: "Learn React Router basics" },
    { id: 4, title: "Frontend Fundamentals", description: "HTML, CSS, and JavaScript essentials" },
  ];

  // ✅ Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin"); // Redirect to login page
  };

  return (
    <div style={{ padding: "40px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#333" }}>Welcome to Your Learning Platform</h1>
      <p style={{ color: "#555", fontSize: "1.1rem" }}>Explore courses and start learning today!</p>

      {/* ✅ Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#ff4b5c",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Logout
      </button>

      <div style={{ marginTop: "30px" }}>
        <h2 style={{ color: "#333" }}>Available Courses:</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {courses.map(course => (
            <li
              key={course.id}
              style={{
                marginBottom: "15px",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                maxWidth: "500px",
                margin: "10px auto",
                textAlign: "left",
                backgroundColor: "#f9f9f9",
              }}
            >
              <strong style={{ fontSize: "1.1rem" }}>{course.title}</strong>
              <p style={{ marginTop: "5px", color: "#666" }}>{course.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
