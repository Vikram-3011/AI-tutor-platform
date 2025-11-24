import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Home from "./Pages/Home.jsx";
import SignIn from "./Pages/SignIn.jsx";
import SignUp from "./Pages/SignUp.jsx";
import Explore from "./Pages/Explore.jsx";
import SubjectDetail from "./Pages/SubjectDetail.jsx";
import UploadSubject from "./Pages/UploadSubject.jsx";
import ManageSubjects from "./Pages/ManageSubjects.jsx";
import EditSubject from "./Pages/EditSubject.jsx";
import Profile from "./Pages/Profile.jsx";
import ManageRoles from "./Pages/ManageRoles.jsx";
import ChatBot from "./Pages/ChatBot.jsx";
import UploadQuiz from "./Pages/UploadQuiz.jsx";
import AttendQuiz from "./Pages/AttendQuiz.jsx";
import Landingpage from "./Pages/LandingPage.jsx";
import ChangePassword from "./Pages/ChangePassword.jsx";
import Mycourse from "./Pages/MyCourses.jsx";
import PerformancePage from "./Pages/PerformancePage.jsx";
import Contact from "./Pages/contact.jsx";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./AuthContext";

// Assets
import homeIcon from "./assets/home.png";
import commentIcon from "./assets/comment.png";
import documentIcon from "./assets/manage.png";
import exploreIcon from "./assets/globe.png";
import plusIcon from "./assets/upload.png";
import userIcon from "./assets/user-add.png";
import logo from "./assets/circle.png";
import courseIcon from "./assets/learning.png";
import "./App.css";

/* ---------- USER MENU ---------- */
function UserMenu({ currentTheme, toggleTheme }) {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    const fetchProfile = async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setAvatar("");
        return;
      }
      setUser(currentUser);

      const emailEncoded = encodeURIComponent(currentUser.email);
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
        console.error("Profile fetch error:", err);
      }
    };

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) fetchProfile(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchProfile(session?.user);
      } else if (event === 'SIGNED_OUT') {
        fetchProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/signin");
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
          {/* Theme Toggle */}
          <div style={styles.dropdownItem} onClick={toggleTheme}>
            {currentTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </div>
          <div style={{...styles.dropdownItem, borderTop: "1px solid var(--menu-border)"}} onClick={handleSignOut}>
            Sign Out
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- MAIN APP ---------- */
function App() {
  const [theme, setTheme] = useState("dark");
  const [userRole, setUserRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const API_BASE = "http://localhost:5000";

  // ✅ 1. Robust Logic to Hide Sidebar (Includes "/" root path)
  const hideSidebarRoutes = ["/landingpage", "/signup", "/signin", "/contact", "/"];
  const hideSidebar = hideSidebarRoutes.some(route => {
    // Exact match or sub-route match (except root which must be exact)
    return location.pathname === route || (route !== "/" && location.pathname.startsWith(route));
  });

  // Theme Toggle
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
    }
  }, [theme]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Fetch Role
  useEffect(() => {
    const fetchAndSetRole = async (currentUser) => {
      if (!currentUser) {
        setUserRole(null);
        setAuthLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/roles/register-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: currentUser.email, 
            name: currentUser.user_metadata?.full_name 
          }),
        });
        
        const data = await res.json();
        if (data.user) {
          if (data.user.is_super) setUserRole("superadmin");
          else if (data.user.is_admin) setUserRole("admin");
          else setUserRole("user");
        } else {
          setUserRole("user");
        }
      } catch (error) {
        console.error("Error fetching role:", error);
        setUserRole("user");
      } finally {
        setAuthLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchAndSetRole(session.user);
      } else {
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setAuthLoading(true);
        fetchAndSetRole(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUserRole(null);
        setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Navigation Items
  const allNavItems = [
    { path: "/home", label: "Home", icon: homeIcon, roles: ["user", "admin", "superadmin"] },
    { path: "/Explore", label: "Explore", icon: exploreIcon, roles: ["user", "admin", "superadmin"] },
    { path: "/chat", label: "AI Chat", icon: commentIcon, roles: ["user", "admin", "superadmin"] },
    { path: "/my-courses", label: "My Courses", icon: courseIcon, roles: ["user", "admin", "superadmin"] },
    { path: "/upload-subject", label: "Upload", icon: plusIcon, roles: ["admin", "superadmin"] },
    { path: "/manage-subjects", label: "Manage Subjects", icon: documentIcon, roles: ["admin", "superadmin"] },
    { path: "/manage-roles", label: "Manage Roles", icon: userIcon, roles: ["superadmin"] },
  ];

  const visibleNavItems = allNavItems.filter(item => item.roles.includes(userRole));

  const RoleRoute = ({ children, allowedRoles }) => {
    if (authLoading) return <div className="loading-screen">Verifying access...</div>;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/home" replace />;
    }
    return children;
  };

  return (
    <div className="app-container">
      
      {/* ✅ 2. Render Sidebar & Mobile Logic ONLY if hideSidebar is FALSE */}
      {!hideSidebar && (
        <>
          {/* Mobile Toggle Button */}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>
          
          {/* Overlay */}
          <div 
            className={`sidebar-overlay ${mobileOpen ? "active" : ""}`} 
            onClick={() => setMobileOpen(false)}
          />

          {/* Sidebar Navigation */}
          <nav className={`sidebar ${theme} ${mobileOpen ? "mobile-open" : ""}`}>
            <div className="nav-header">
              <img src={logo} alt="RitLens Logo" />
              <h2 className="logo">RitLens</h2>
            </div>

            <ul className="nav-links">
              {visibleNavItems.map((item) => (
                <li key={item.path}>
                  <a href={item.path}>
                    <img src={item.icon} alt={item.label} className="nav-icon" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            <UserMenu currentTheme={theme} toggleTheme={toggleTheme} />
          </nav>
        </>
      )}

      {/* ✅ 3. FIXED: Apply style to remove margin if sidebar is hidden */}
      <div 
        className="main-content" 
        style={{ marginLeft: hideSidebar ? "0" : "", width: hideSidebar ? "100%" : "" }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/landingpage" replace />} />
          <Route path="/landingpage" element={<Landingpage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes */}
          <Route path="/home" element={ <ProtectedRoute> <Home /> </ProtectedRoute>} />
          <Route path="/Explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
          <Route path="/subject/:name" element={<ProtectedRoute><SubjectDetail /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatBot /></ProtectedRoute>} />
          <Route path="/take-quiz/:subjectName/:topicTitle" element={<AttendQuiz />} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/my-courses" element={<ProtectedRoute><Mycourse /></ProtectedRoute>} />
          <Route path="/performance" element={<ProtectedRoute><PerformancePage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/upload-subject" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "superadmin"]}>
                <UploadSubject />
              </RoleRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/manage-subjects" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "superadmin"]}>
                <ManageSubjects />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path="/edit-subject/:id" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "superadmin"]}>
                <EditSubject />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path="/upload-quiz" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "superadmin"]}>
                <UploadQuiz />
              </RoleRoute>
            </ProtectedRoute>
          } />

          {/* SuperAdmin Route */}
          <Route path="/manage-roles" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["superadmin"]}>
                <ManageRoles />
              </RoleRoute>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}

/* ---------- STYLES (Using CSS Vars) ---------- */
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
    color: "var(--text-primary)",
    fontWeight: "600",
  },
  userDropdown: {
    position: "absolute",
    bottom: "60px",
    left: "10px",
    width: "calc(100% - 20px)",
    background: "var(--menu-bg)",
    borderRadius: "15px",
    overflow: "hidden",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    border: "1px solid var(--menu-border)",
    boxShadow: "var(--menu-shadow)",
  },
  dropdownItem: {
    padding: "12px 15px",
    color: "var(--text-primary)",
    cursor: "pointer",
    borderBottom: "1px solid var(--menu-border)",
    fontSize: "0.95rem",
  },
};  