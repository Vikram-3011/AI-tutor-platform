import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/twitch.png"; 
import heroImage from "../assets/tutor1.png"; 

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-left">
          <img src={logo} alt="AI Tutor Logo" className="logo" />
          <span className="logo-text">AI Tutor</span>
        </div>
        <div className="nav-right">
          <button className="btn" onClick={() => navigate("/signup")}>Sign Up</button>
          <button className="btn btn-outline" onClick={() => navigate("/signin")}>Sign In</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Learn Smarter with AI Tutor</h1>
          <p>Interactive lessons, quizzes, and AI-powered guidance to boost your learning experience.</p>
          <button className="btn btn-hero" onClick={() => navigate("/signup")}>Get Started</button>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="AI Learning" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Features</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>Interactive Quizzes</h3>
            <p>Test your knowledge and get instant feedback.</p>
          </div>
          <div className="card">
            <h3>AI Assistance</h3>
            <p>Get personalized guidance and recommendations.</p>
          </div>
          <div className="card">
            <h3>Track Progress</h3>
            <p>Monitor your learning and improve over time.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2025 AI Tutor. All rights reserved.</p>
      </footer>

      {/* CSS */}
      <style>{`
        /* Root Colors & Fonts */
        :root {
          --primary-color: #4f46e5;
          --secondary-color: #22d3ee;
          --bg-color: #0f172a;
          --text-color: #f8fafc;
          --card-bg: #1e293b;
          --btn-hover: #6366f1;
          --btn-outline-hover: #38bdf8;
          --btn-hero-hover: #6366f1;
        }

        .landing-container {
          background-color: var(--bg-color);
          min-height: 100vh;
          color: var(--text-color);
          font-family: 'Poppins', sans-serif;
        }

        /* Navbar */
        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 50px;
          background: rgba(15,23,42,0.95);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-left .logo {
          width: 45px;
          height: 45px;
        }

        .nav-left .logo-text {
          font-size: 24px;
          font-weight: 700;
        }

        .nav-right .btn {
          margin-left: 15px;
          padding: 10px 22px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
          font-size: 16px;
        }

        .nav-right .btn:hover {
          background-color: var(--btn-hover);
          color: #fff;
        }

        .nav-right .btn-outline {
          background: transparent;
          border: 2px solid var(--secondary-color);
          color: var(--secondary-color);
        }

        .nav-right .btn-outline:hover {
          background: var(--secondary-color);
          color: #0f172a;
        }

        /* Hero Section */
        .hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 80px 50px;
          flex-wrap: wrap;
        }

        .hero-content {
          max-width: 600px;
        }

        .hero h1 {
          font-size: 50px;
          margin-bottom: 20px;
          color: var(--secondary-color);
          line-height: 1.2;
        }

        .hero p {
          font-size: 18px;
          margin-bottom: 30px;
          line-height: 1.6;
          color: #cbd5e1;
        }

        .btn-hero {
          background-color: var(--secondary-color);
          color: #0f172a;
          padding: 14px 30px;
          border-radius: 12px;
          font-size: 18px;
          border: none;
          transition: 0.3s;
        }

        .btn-hero:hover {
          background-color: var(--btn-hero-hover);
          color: #fff;
        }

        .hero-image img {
          max-width: 500px;
          width: 100%;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        /* Features Section */
        .features {
          padding: 60px 50px;
          text-align: center;
          background-color: #111827;
        }

        .features h2 {
          font-size: 36px;
          margin-bottom: 50px;
          color: var(--secondary-color);
        }

        .feature-cards {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
        }

        .feature-cards .card {
          background-color: var(--card-bg);
          padding: 30px 20px;
          border-radius: 20px;
          width: 250px;
          transition: transform 0.3s, box-shadow 0.3s;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .feature-cards .card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 25px rgba(0,0,0,0.5);
        }

        .feature-cards h3 {
          font-size: 22px;
          margin-bottom: 15px;
          color: var(--secondary-color);
        }

        .feature-cards p {
          font-size: 16px;
          color: #cbd5e1;
        }

        /* Footer */
        .landing-footer {
          text-align: center;
          padding: 25px 0;
          background: rgba(15,23,42,0.95);
          color: #94a3b8;
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .hero {
            flex-direction: column-reverse;
            text-align: center;
            gap: 40px;
          }

          .hero-image img {
            max-width: 80%;
          }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
