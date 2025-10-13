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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user: supaUser } } = await supabase.auth.getUser();
        if (!supaUser) {
          navigate("/signin");
          return;
        }
        setUser(supaUser);

        const emailEncoded = encodeURIComponent(supaUser.email);
        let res = await fetch(`${API_BASE_URL}/api/profile/${emailEncoded}`);
        if (res.status === 404) {
          res = await fetch(`${API_BASE_URL}/api/create-profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: supaUser.email }),
          });
          const data = await res.json();
          setProfile({ ...profile, email: data.user.email });
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
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const emailEncoded = encodeURIComponent(user.email);
      const res = await fetch(`${API_BASE_URL}/api/profile/${emailEncoded}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      setMessage("Profile updated successfully!");
      // Automatically hide the message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading)
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your profile...</p>
      </div>
    );

  const getInitial = () => profile.email?.[0]?.toUpperCase() || "?";

  return (
    <div style={styles.page}>
      {/* Title on top */}
      <h1 style={styles.title}>Your Profile</h1>

      <div style={styles.card}>
        <div style={styles.avatarSection}>
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Avatar"
              style={styles.avatar}
            />
          ) : (
            <div style={styles.avatarPlaceholder}>{getInitial()}</div>
          )}
          <label style={styles.uploadLabel}>
            Upload Avatar
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Your name"
            style={styles.input}
            required
          />

          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            disabled
            style={{ ...styles.input, backgroundColor: "rgba(255,255,255,0.15)" }}
          />

          <label style={styles.label}>Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            style={styles.textarea}
          />

          <label style={styles.label}>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={profile.dob}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Your phone number"
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Save Profile
          </button>

          {/* Message below the button */}
          {message && <p style={styles.message}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

/* --- PREMIUM LUXURY STYLES --- */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column", // ensure title on top
    alignItems: "center",
    background: "linear-gradient(135deg, #0c111b, #1b2430)",
    fontFamily: "'Poppins', sans-serif",
    padding: "40px 20px",
  },
  title: {
    fontSize: "2.5rem",
    color: "#fef9f3",
    marginBottom: "25px",
    fontWeight: "700",
    textAlign: "center",
    textShadow: "0 2px 10px rgba(0,0,0,0.6)",
    zIndex: 10,
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    background: "rgba(255,255,255,0.05)",
    padding: "35px",
    borderRadius: "20px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.7)",
    border: "1px solid rgba(255,255,255,0.15)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatarSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "25px",
  },
  avatar: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid rgba(255, 215, 0, 0.7)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
    marginBottom: "10px",
    transition: "all 0.3s ease",
  },
  avatarPlaceholder: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    background: "linear-gradient(145deg, #333, #111)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    color: "#ffd700",
    marginBottom: "10px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
  },
  uploadLabel: {
    color: "#ffd700",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.95rem",
  },
  form: { display: "flex", flexDirection: "column", width: "100%", gap: "18px" },
  label: { color: "#fef9f3", fontWeight: "600", fontSize: "0.9rem" },
  input: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "#fef9f3",
    outline: "none",
    fontSize: "1rem",
    backdropFilter: "blur(5px)",
    transition: "all 0.3s ease",
  },
  textarea: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "#fef9f3",
    outline: "none",
    fontSize: "1rem",
    minHeight: "90px",
    backdropFilter: "blur(5px)",
    transition: "all 0.3s ease",
  },
  button: {
    padding: "14px",
    borderRadius: "30px",
    border: "none",
    background: "linear-gradient(135deg, #222, #444)",
    color: "#ffd700",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
  },
  message: {
    color: "#ffd700",
    marginTop: "10px",
    textAlign: "center",
    fontWeight: "500",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(145deg, #0c111b, #1b2430)",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255,255,255,0.2)",
    borderTop: "5px solid #ffd700",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "15px",
    fontSize: "1.2rem",
    color: "#fef9f3",
  },
};

// Spinner animation
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;
document.head.appendChild(styleSheet);

export default Profile;
