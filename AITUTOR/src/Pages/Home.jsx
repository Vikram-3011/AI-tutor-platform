import React from "react";

const Home = () => {
  const courses = [
    { id: 1, title: "React Basics", description: "Learn the basics of React.js" },
    { id: 2, title: "Vite Setup", description: "Set up a modern React project with Vite" },
    { id: 3, title: "Routing in React", description: "Learn React Router basics" },
    { id: 4, title: "Frontend Fundamentals", description: "HTML, CSS, and JavaScript essentials" },
  ];

  return (
    <div style={{ padding: "40px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#333" }}>Welcome to Your Learning Platform</h1>
      <p style={{ color: "#555", fontSize: "1.1rem" }}>Explore courses and start learning today!</p>

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
