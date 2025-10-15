import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Home from "./Pages/Home.jsx";
import SignIn from "./Pages/SignIn.jsx";
import SignUp from "./Pages/SignUp.jsx";
import Explore from "./Pages/Explore.jsx";
import SubjectDetail from "./Pages/SubjectDetail.jsx";
import UploadSubject from "./Pages/UploadSubject.jsx";
import ManageSubjects from "./Pages/ManageSubjects.jsx";
import EditSubject from "./Pages/EditSubject.jsx";
import Profile from "./Pages/Profile.jsx";
import { supabase } from "./supabaseClient";
import "./App.css";
import ManageRoles from "./Pages/ManageRoles.jsx";
import ChatBot from "./Pages/ChatBot.jsx";
import UploadQuiz from "./Pages/UploadQuiz";
import AttendQuiz from "./Pages/AttendQuiz";
import Landingpage from "./Pages/LandingPage.jsx";
import ChangePassword from "./Pages/ChangePassword.jsx";
import Mycourse from "./Pages/MyCourses.jsx";

import homeIcon from "./assets/home.png";
import commentIcon from "./assets/comment.png";
import documentIcon from "./assets/manage.png";
import exploreIcon from "./assets/globe.png";
import plusIcon from "./assets/upload.png";
import userIcon from "./assets/user-add.png";
import logo from "./assets/twitch.png";
import courseIcon from "./assets/learning.png";

// ✅ Sidebar User Avatar Menu
function UserMenu({ theme, setTheme }) {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

   const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: supaUser } } = await supabase.auth.getUser();
      if (!supaUser) return;
      setUser(supaUser);

      const emailEncoded = encodeURIComponent(supaUser.email);
      try {
       const res = await fetch(`${API_BASE}/api/profile/${emailEncoded}`);
         if (res.ok) {
          const data = await res.json();
          if (data.avatar) {
            const base64Avatar = data.avatar.startsWith("data:")
              ? data.avatar
              : `data:image/png;base64,${data.avatar}`;
            setAvatar(base64Avatar);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

const handleSignOut = async () => {
  try {
    await supabase.auth.signOut();
    navigate("/signin");
    window.location.reload(); // ✅ force refresh after navigating
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

  const getInitial = () => user?.email?.[0]?.toUpperCase() || "?";

  return (
    <div style={styles.userMenuContainer}>
      <div style={styles.userInfo} onClick={() => setMenuOpen(!menuOpen)}>
        {avatar ? (
          <img src={avatar} alt="Avatar" style={styles.userAvatar} />
        ) : (
          <div style={styles.userAvatarPlaceholder}>{getInitial()}</div>
        )}
        <span style={styles.userName}>{user?.email?.split("@")[0]}</span>
      </div>
      {menuOpen && (
        <div style={styles.userDropdown}>
          <div style={styles.dropdownItem} onClick={() => navigate("/profile")}>
            Profile
          </div>
         
          <div style={styles.dropdownItem} onClick={handleSignOut}>
            Sign Out
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <nav className={`sidebar ${theme}`}>
          <div className="nav-header" >
  <img src={logo} alt="AI Tutor Logo"  />
  <h2 className="logo" >AI Tutor</h2>
</div>


          <ul className="nav-links">
            <li><a href="/home">  <img src={homeIcon} alt="Home" className="nav-icon" /><span>Home</span></a></li>
            <li><a href="/Explore"> <img src={exploreIcon} alt="Home" className="nav-icon" /><span>Explore</span></a></li>
            <li><a href="/upload-subject"> <img src={plusIcon} alt="Home" className="nav-icon" /><span>Upload</span></a></li>
            <li><a href="/manage-subjects"> <img src={documentIcon} alt="Home" className="nav-icon" /><span>Manage Subjects</span></a></li>
            <li><a href="/manage-roles"> <img src={userIcon} alt="Home" className="nav-icon" /><span>Manage Roles</span></a></li>
            <li><a href="/chat"> <img src={commentIcon} alt="Home" className="nav-icon" /><span>AI Chat</span></a></li>
            <li><a href="/landingpage"> <img src={commentIcon} alt="Home" className="nav-icon" /><span>landingpage</span></a></li>
            <li><a href="/my-courses"> <img src={courseIcon} alt="Home" className="nav-icon" /><span>My Courses</span></a></li>
          </ul>

          {/* Bottom User Menu */}
          <UserMenu theme={theme} setTheme={setTheme} />
        </nav>

        {/* Main Content */}
        <div className="main-content">
          <Routes>
            
            <Route path="/landingpage" element={<Landingpage />} />
            <Route path="/upload-subject" element={<UploadSubject />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/Explore" element={<Explore />} />
            <Route path="/subject/:name" element={<SubjectDetail />} />
            <Route path="/" element={<Navigate to="/signup" replace />} />
            <Route path="/manage-subjects" element={<ManageSubjects />} />
            <Route path="/edit-subject/:id" element={<EditSubject />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/manage-roles" element={<ManageRoles />} />
            <Route path="/chat" element={<ChatBot />} />
            <Route path="/upload-quiz/:subjectName/:topicTitle" element={<UploadQuiz />} />
            <Route path="/take-quiz/:subjectName/:topicTitle" element={<AttendQuiz />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/my-courses" element={<Mycourse />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

/* --- STYLES --- */
const styles = {
  userMenuContainer: {
    marginTop: "auto",
    marginBottom: "20px",
    position: "relative",
    width: "100%",
    cursor: "pointer",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    background: "rgba(0,0,0,0.1)",
    borderRadius: "15px",
    margin: "0 10px",
  },
  userAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "10px",
  },
  userAvatarPlaceholder: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#0072ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontWeight: "bold",
    marginRight: "10px",
  },
  userName: {
    color: "#fff",
    fontWeight: "600",
  },
  userDropdown: {
    position: "absolute",
    bottom: "60px",
    left: "10px",
    width: "calc(100% - 20px)",
    background: "rgba(0,0,0,0.9)",
    borderRadius: "15px",
    overflow: "hidden",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
  },
  dropdownItem: {
    padding: "10px 15px",
    color: "#fff",
    cursor: "pointer",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  
  
};

export default App;
