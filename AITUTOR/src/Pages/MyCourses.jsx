import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; 
import { API_BASE_URL } from "../config";

function ManageRoles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentEmail, setCurrentEmail] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) {
      navigate("/signin");
      return;
    }
    setCurrentEmail(data.user.email);
    fetchUsers(data.user.email);
  };

  const fetchUsers = async (email) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/roles/all`);
      const data = await res.json();
      const requester = data.find((u) => u.email === email);

      if (!requester || requester.role !== "superadmin") {
        setMessage("Access denied. Only super admin can view this page.");
        setLoading(false);
        return;
      }

      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Error loading users");
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handlePromote = async (targetEmail) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/roles/promote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterEmail: currentEmail, targetEmail }),
      });
      const data = await res.json();
      showNotification(data.message);
      fetchUsers(currentEmail);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDemote = async (targetEmail) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/roles/demote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterEmail: currentEmail, targetEmail }),
      });
      const data = await res.json();
      showNotification(data.message);
      fetchUsers(currentEmail);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading)
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading users...</p>
      </div>
    );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>⚙️ Role Management</h1>
      <p style={styles.note}>Only Super Admin can access this page.</p>

      {message && <div style={styles.notification}>{message}</div>}

      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <p style={styles.noData}>No users found.</p>
      ) : (
        <div style={styles.userGrid}>
          {filteredUsers.map((user) => (
            <div key={user.email} style={styles.userCard}>
              <div style={styles.userInfo}>
                <h3 style={styles.userName}>{user.name || "Unnamed User"}</h3>
                <p style={styles.userEmail}>{user.email}</p>
                <span style={styles.roleBadge(user.role)}>{user.role}</span>
              </div>
              <div style={styles.actions}>
                {user.role !== "superadmin" && (
                  <>
                    {user.role === "user" ? (
                      <button style={styles.promoteBtn} onClick={() => handlePromote(user.email)}>Promote</button>
                    ) : (
                      <button style={styles.demoteBtn} onClick={() => handleDemote(user.email)}>Demote</button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "50px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
    background: "radial-gradient(circle at 20% 20%, #0f172a, #020617 70%)",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: "10px",
    textAlign: "center",
    textShadow: "0 2px 12px rgba(0,0,0,0.6)",
  },
  note: { color: "#cbd5e1", marginBottom: "20px" },
  notification: {
    color: "#ffd700",
    background: "rgba(255,215,0,0.1)",
    padding: "10px 15px",
    borderRadius: "15px",
    marginBottom: "20px",
    fontWeight: "500",
    textAlign: "center",
  },
  filters: { display: "flex", gap: "15px", marginBottom: "30px", flexWrap: "wrap" },
  search: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "#fef9f3",
    outline: "none",
    fontSize: "1rem",
    backdropFilter: "blur(5px)",
  },
  select: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "#fef9f3",
    fontSize: "1rem",
    cursor: "pointer",
  },
  userGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
    width: "100%",
    maxWidth: "1000px",
  },
  userCard: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 15px 45px rgba(0,0,0,0.6)",
    cursor: "default",
    transition: "transform 0.2s ease",
  },
  userInfo: { marginBottom: "15px" },
  userName: { fontSize: "1.2rem", fontWeight: "600", margin: 0, color: "#fef9f3" },
  userEmail: { color: "#cbd5e1", fontSize: "0.9rem", margin: "5px 0" },
  roleBadge: (role) => ({
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#fff",
    textTransform: "capitalize",
    background:
      role === "superadmin"
        ? "linear-gradient(135deg,#16a34a,#22c55e)"
        : role === "admin"
        ? "linear-gradient(135deg,#3b82f6,#60a5fa)"
        : "linear-gradient(135deg,#64748b,#94a3b8)",
  }),
  actions: { display: "flex", gap: "10px" },
  promoteBtn: {
    padding: "8px 15px",
    borderRadius: "20px",
    border: "none",
    background: "linear-gradient(135deg,#22c55e,#16a34a)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
  demoteBtn: {
    padding: "8px 15px",
    borderRadius: "20px",
    border: "none",
    background: "linear-gradient(135deg,#ef4444,#b91c1c)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
  noData: { color: "#fff", textAlign: "center", fontSize: "1.1rem", opacity: 0.9 },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  spinner: {
    width: "55px",
    height: "55px",
    border: "5px solid rgba(255,255,255,0.2)",
    borderTop: "5px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "15px",
    fontSize: "1.1rem",
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

export default ManageRoles;
