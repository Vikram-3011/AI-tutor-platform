import React from "react";
import { useNavigate } from "react-router-dom";
// Assuming you have these assets
import logo from "../assets/circle.png";
import heroImage from "../assets/landingAI.png";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Background Gradient Effect */}
      <div className="gradient-bg"></div>

      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-left">
          <img src={logo} alt="Ritlens Logo" className="logo" />
          <span className="logo-text">Ritlens</span>
        </div>
        <div className="nav-right">
          <button className="btn nav-btn-outline" onClick={() => navigate("/signin")}>
            Sign In
          </button>
          <button className="btn nav-btn-primary" onClick={() => navigate("/signup")}>
            Start Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Unlock <span className="highlight-text">Smarter Learning</span> with AI Tutor
          </h1>
          <p>
            Interactive lessons, adaptive quizzes, and personalized AI-powered guidance designed to accelerate your mastery of any subject.
          </p>
          <button className="btn btn-hero" onClick={() => navigate("/signup")}>
             Get Started Today
          </button>
          <div className="small-text">
             No credit card required.
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="AI Learning illustration" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Features Designed for <span className="highlight-text">Your Success</span></h2>
        <div className="feature-cards">
          <div className="card">
            <div className="icon-box">🧠</div>
            <h3>Adaptive Learning Paths</h3>
            <p>Our AI customizes your curriculum based on your strengths and weaknesses.</p>
          </div>
          <div className="card">
            <div className="icon-box">✅</div>
            <h3>Instant Quizzes & Feedback</h3>
            <p>Reinforce knowledge immediately with engaging, auto-graded practice sessions.</p>
          </div>
          <div className="card">
            <div className="icon-box">📈</div>
            <h3>Detailed Progress Tracking</h3>
            <p>Visualize your growth and identify areas for improvement with comprehensive reports.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <button className="contact-button" onClick={() => navigate("/contact")}>
  Contact
</button>
        <p>&copy; 2025 AI Tutor. All rights reserved.</p>
      </footer>

      {/* CSS - Updated for a more awesome look */}
      <style>{`
        /* --- Root Colors & Fonts --- */
        :root {
          --primary-color: #2563eb; /* Blue 600 - Used for main buttons/accents */
          --secondary-color: #3b82f6; /* Blue 500 - Lighter blue for highlights */
          --bg-color: #0f172a; /* Slate 900 - Dark, deep background */
          --text-color: #e2e8f0; /* Slate 200 - Light text */
          --card-bg: #1e293b; /* Slate 800 - Slightly lighter background for cards */
          --accent-color: #4f46e5; /* Indigo */
        }

        /* --- Global Reset & Container --- */
        .landing-container {
          background-color: var(--bg-color);
          min-height: 100vh;
          color: var(--text-color);
          font-family: 'Inter', sans-serif; /* Modern, clean font */
          overflow-x: hidden;
          position: relative;
        }

        /* --- Background Effect --- */
        .gradient-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.1) 0%, transparent 40%),
                        radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
        }

        /* --- Navbar --- */
        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 50px;
          background: rgba(15, 23, 42, 0.9); /* Subtle transparency for modern feel */
          backdrop-filter: blur(8px);
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid rgba(30, 41, 59, 0.7);
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-left .logo {
          width: 35px;
          height: 35px;
          border-radius: 50%;
        }

        .nav-left .logo-text {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: var(--secondary-color);
        }

        /* --- Buttons --- */
        .btn {
          margin-left: 12px;
          padding: 10px 20px;
          border-radius: 9999px; /* Pill shape */
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 15px;
          border: none;
        }

        /* Navbar Primary Button */
        .nav-btn-primary {
            background-color: var(--primary-color);
            color: #fff;
        }
        .nav-btn-primary:hover {
            background-color: #1d4ed8; /* Darker blue */
            transform: translateY(-1px);
        }

        /* Navbar Outline Button */
        .nav-btn-outline {
            background: transparent;
            border: 2px solid var(--text-color);
            color: var(--text-color);
            padding: 8px 18px;
        }
        .nav-btn-outline:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--secondary-color);
        }

        /* --- Hero Section --- */
        .hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 100px 50px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .hero-content {
          max-width: 550px;
        }

        .hero h1 {
          font-size: 60px;
          margin-bottom: 25px;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .highlight-text {
            color: var(--secondary-color);
            text-shadow: 0 0 15px rgba(59, 130, 246, 0.5); /* Glowing effect */
        }

        .hero p {
          font-size: 19px;
          margin-bottom: 40px;
          line-height: 1.5;
          color: #94a3b8; /* Slate 400 */
        }

        /* Hero Call-to-Action Button */
        .btn-hero {
          background-color: var(--primary-color);
          color: #fff;
          padding: 15px 35px;
          border-radius: 12px;
          font-size: 20px;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
        }

        .btn-hero:hover {
          background-color: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(37, 99, 235, 0.6);
        }
        
        .small-text {
            margin-top: 15px;
            font-size: 14px;
            color: #64748b;
        }

        .hero-image {
          position: relative;
          perspective: 1000px; /* For 3D transform effect */
        }

        .hero-image img {
          max-width: 500px;
          width: 100%;
          border-radius: 20px;
          object-fit: cover;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          transform: rotateY(5deg) scale(1.05); /* Slight 3D tilt */
          transition: transform 0.5s;
        }
        
        .hero-image img:hover {
            transform: rotateY(0deg) scale(1.0);
        }

        /* --- Features Section --- */
        .features {
          padding: 80px 50px;
          text-align: center;
          background-color: #111827; /* Slightly different dark shade */
        }

        .features h2 {
          font-size: 40px;
          margin-bottom: 70px;
          font-weight: 800;
        }

        .feature-cards {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
          max-width: 1100px;
          margin: 0 auto;
        }

        .feature-cards .card {
          background-color: var(--card-bg);
          padding: 30px 25px;
          border-radius: 16px;
          width: 300px;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          border: 1px solid #334155; /* Subtle border */
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        }

        .feature-cards .card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 40px rgba(37, 99, 235, 0.2);
          border-color: var(--primary-color);
        }

        .icon-box {
            font-size: 30px;
            margin-bottom: 20px;
            display: inline-block;
            background: var(--primary-color);
            padding: 10px 15px;
            border-radius: 10px;
        }

        .feature-cards h3 {
          font-size: 24px;
          margin-bottom: 10px;
          color: var(--secondary-color);
        }

        .feature-cards p {
          font-size: 16px;
          color: #aebacd;
        }

        /* --- Footer --- */
        .landing-footer {
          text-align: center;
          padding: 30px 0;
          background: #0d1421;
          color: #64748b;
          font-size: 15px;
          border-top: 1px solid #1e293b;
        }
                  /* --- Contact Button (Bottom Right) --- */
    .contact-button {
     
      bottom: 25px;
      right: 25px;
      padding: 14px 28px;
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(37, 99, 235, 0.4);
      z-index: 200;
      transition: 0.3s ease-in-out;
    }

    .contact-button:hover {
      transform: scale(1.07);
      background: #1d4ed8;
    }
            /* --- Responsive Design --- */
        @media (max-width: 1100px) {
          .hero {
             flex-direction: column-reverse;
             text-align: center;
             padding: 80px 30px;
             gap: 60px;
          }

          .hero-content {
             max-width: 100%;
          }

          .hero h1 {
             font-size: 48px;
          }
        }



        @media (max-width: 600px) {
           .landing-nav {
              padding: 15px 20px;
           }
           .hero {
              padding: 60px 20px;
           }
           .hero h1 {
              font-size: 38px;
              letter-spacing: normal;
           }
           .hero-image img {
              max-width: 100%;
           }
           .features {
              padding: 60px 20px;
           }
           .nav-right .btn {
              margin-left: 8px;
              padding: 8px 15px;
              font-size: 14px;
           }
           .feature-cards .card {
              width: 100%;
              max-width: 350px;
           }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;