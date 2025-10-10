import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import SignIn from "./Pages/SignIn.jsx";
import SignUp from "./Pages/SignUp.jsx";
import Explore from "./Pages/Explore.jsx";
import SubjectDetail from "./Pages/SubjectDetail.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar Navigation */}
        <nav className="sidebar">
          <div className="nav-header">
            <div className="logo-section">
              
              <h2 className="logo">AI Tutor</h2>
            </div>
          </div>

          <ul className="nav-links">
            <li>
              <a href="/home">
                <i className="fas fa-home"></i>
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="/Explore">
                <i className="fas fa-compass"></i>
                <span>Explore</span>
              </a>
            </li>
            <li>
              <a href="/signin">
                <i className="fas fa-sign-in-alt"></i>
                <span>Sign In</span>
              </a>
            </li>
            <li>
              <a href="/signup">
                <i className="fas fa-user-plus"></i>
                <span>Sign Up</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="main-content">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/Explore" element={<Explore />} />
            <Route path="/subject/:name" element={<SubjectDetail />} />
            <Route path="/" element={<Navigate to="/signup" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
