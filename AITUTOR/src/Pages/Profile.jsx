import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
    dob: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 1. Get Supabase User
        const { data: { user: supaUser } } = await supabase.auth.getUser();
        if (!supaUser) {
          navigate("/signin");
          return;
        }
        setUser(supaUser);

        // 2. Fetch Profile from Custom API
        const emailEncoded = encodeURIComponent(supaUser.email);
        let res = await fetch(`${API_BASE_URL}/api/profile/${emailEncoded}`);

        // 3. Handle Profile Creation if 404
        if (res.status === 404) {
          res = await fetch(`${API_BASE_URL}/api/create-profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: supaUser.email }),
          });
          const data = await res.json();
          setProfile(p => ({ ...p, email: data.user.email }));
        } else {
          const data = await res.json();
          setProfile({
            name: data.name || "",
            email: data.email,
            bio: data.bio || "",
            avatar: data.avatar || "",
            dob: data.dob || "",
            phone: data.phone || "",
          });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 200 * 1024; // 200 KB

    if (file.size > maxSize) {
      setMessage("Image size must be below 200 KB ");
      setTimeout(() => { setMessage(""); }, 3000);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsUpdating(true);

    try {
      const emailEncoded = encodeURIComponent(user.email);
      const res = await fetch(`${API_BASE_URL}/api/profile/${emailEncoded}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      setMessage("Profile updated successfully! ");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile ");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const getInitial = () => profile.email?.[0]?.toUpperCase() || "?";

  // --- RENDER LOGIC ---

  if (loading)
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your profile...</p>
      </div>
    );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}> User Profile</h1>

      <div style={styles.card}>
        {/* --- Avatar Section --- */}
        <div style={styles.avatarSection}>
          {profile.avatar ? (
            <img src={profile.avatar} alt="Avatar" style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}>{getInitial()}</div>
          )}
          <label style={styles.uploadLabel}>
            Upload Avatar
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </label>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* --- Profile Fields --- */}
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">Name</label>
            <input
              type="text" id="name" name="name"
              value={profile.name} onChange={handleChange}
              placeholder="Your name" style={styles.input} required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input
              type="email" id="email" name="email"
              value={profile.email} disabled
              style={{ ...styles.input, ...styles.disabledInput }}
            />
          </div>
          
          <div style={styles.twoColumnGrid}>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="dob">Date of Birth</label>
                <input
                    type="date" id="dob" name="dob"
                    value={profile.dob} onChange={handleChange}
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="phone">Phone Number</label>
                <input
                    type="number" id="phone" name="phone"
                    value={profile.phone} onChange={handleChange}
                    placeholder="Your phone number" style={styles.input}
                />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="bio">Bio</label>
            <textarea
              id="bio" name="bio"
              value={profile.bio} onChange={handleChange}
              placeholder="Tell us about yourself..." style={styles.textarea}
            />
          </div>

          {/* --- Action Buttons --- */}
          <button type="submit" style={styles.button} disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Profile Changes"}
          </button>
          
          <div style={styles.buttonGroup}>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => navigate("/change-password")}
            >
               Change Password
            </button>
            <button
              type="button"
              style={styles.contactButton}
              onClick={() => navigate("/contact")} // Assuming your contact route is /contact
            >
               Admin Access
            </button>
          </div>
          
          {message && <p style={styles.message}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// --- RESTRUCTURED & ENHANCED STYLES ---
// ----------------------------------------------------
const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // Soft, deep background
        background: "linear-gradient(135deg, #0f172a, #1e293b)", 
        fontFamily: "'Inter', sans-serif",
        padding: "40px 20px",
    },
    title: {
        fontSize: "2.8rem",
        color: "#f8faff",
        marginBottom: "35px",
        fontWeight: "800",
        textAlign: "center",
        textShadow: "0 4px 15px rgba(0,0,0,0.5)",
    },
    card: {
        width: "100%",
        maxWidth: "600px", // Increased max width for better form layout
        background: "rgba(255, 255, 255, 0.08)", // Lighter card background
        padding: "40px",
        borderRadius: "24px",
        backdropFilter: "blur(15px)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
        border: "1px solid rgba(36, 113, 221, 0.29)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", 
    },
    avatarSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "30px",
    },
    avatar: {
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        objectFit: "cover",
        // Vibrant gold border
        border: "4px solid #fffffeff", 
        boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
        marginBottom: "15px",
        transition: "all 0.3s ease",
    },
    avatarPlaceholder: {
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: "linear-gradient(145deg, #334155, #1e293b)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "3rem",
        color: "#f5f5f5ff", // Gold text color
        marginBottom: "15px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
    },
    uploadLabel: {
        color: "#a8a8a8",
        fontWeight: "500",
        cursor: "pointer",
        fontSize: "0.95rem",
        padding: "5px 10px",
        borderRadius: "8px",
        border: "1px dashed #4b5563",
    },
    form: { 
        display: "flex", 
        flexDirection: "column", 
        width: "100%", 
        gap: "18px" 
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    twoColumnGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
    },
    label: { 
        color: "#e2e8f0", 
        fontWeight: "600", 
        fontSize: "0.9rem" 
    },
    input: {
        padding: "12px 16px",
        borderRadius: "10px",
        border: "1px solid #4b5563",
        background: "rgba(231, 229, 229, 0.05)",
        color: "#f8faff",
        outline: "none",
        fontSize: "1rem",
        transition: " 0.3s ease",
    },
    disabledInput: {
        backgroundColor: "rgba(49, 49, 49, 0.4)", // Darker gray for disabled
        cursor: "not-allowed",
    },
    textarea: {
        padding: "12px 16px",
        borderRadius: "10px",
        border: "1px solid #4b5563",
        background: "rgba(255, 255, 255, 0.05)",
        color: "#f8faff",
        outline: "none",
        fontSize: "1rem",
        minHeight: "100px",
        resize: "vertical",
        transition: " ",
    },
    button: {
        padding: "15px",
        borderRadius: "10px",
        border: "none",
        // Primary Save Button Style (Orange/Gold)
        background: "linear-gradient(90deg, #2184daff, #345ceaff)", 
        color: "#fff",
        fontWeight: "700",
        cursor: "pointer",
        fontSize: "1rem",
        marginTop: "10px",
        boxShadow: "0 4px 15px rgba(36, 35, 35, 0.5)",
        transition: "background 0.3s ease, transform 0.1s ease",
    },
    buttonGroup: {
        display: "flex",
        gap: "10px",
        marginTop: "10px",
    },
    secondaryButton: {
        flex: 1,
        padding: "15px",
        borderRadius: "10px",
        border: "none",
        background: "linear-gradient(135deg, #334155, #1e293b)",
        color: "#e2e8f0",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "background 0.3s ease",
    },
    contactButton: {
        flex: 1,
        padding: "15px",
        borderRadius: "10px",
        border: "none",
        // Contact Button Style (Subtle Blue)
        background: "linear-gradient(135deg, #0ea5e9, #38bdf8)", 
        color: "#fff",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "background 0.3s ease",
    },
    message: {
        color: "#3665e7ff",
        marginTop: "15px",
        textAlign: "center",
        fontWeight: "600",
        fontSize: "0.95rem",
    },
    // --- Loading Styles (Simplified) ---
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(145deg, #0f172a, #1e293b)",
    },
    spinner: {
        width: "40px",
        height: "40px",
        border: "4px solid rgba(255,255,255,0.2)",
        borderTop: "4px solid #3760dbff",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
    },
    loadingText: {
        marginTop: "15px",
        fontSize: "1.1rem",
        color: "#e2e8f0",
    },
};

// Add the spin animation globally
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Enhancing input focus */
input:focus, textarea:focus {
    border-color: #1f58ddff !important;
    box-shadow: 0 0 0 2px rgba(61, 141, 215, 0.3);
}

/* Button Hover Effects */
button:not(:disabled):hover {
    filter: brightness(1.1);
}
`;
document.head.appendChild(styleSheet);

export default Profile;