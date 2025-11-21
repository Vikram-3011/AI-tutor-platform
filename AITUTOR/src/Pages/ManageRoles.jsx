import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

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
      <div style={styles.loadingPage}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading Users...</p>
      </div>
    );

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <h1 style={styles.title}>Role Management</h1>
        <p style={styles.subtitle}>Manage user roles • Super Admin Only</p>

        {message && <div style={styles.notification}>{message}</div>}

        <div style={styles.filters}>
          <input
            type="text"
            placeholder="🔍 Search users..."
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
            <option value="superadmin">Super Admin</option>
          </select>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length ? (
                filteredUsers.map((user) => (
                  <tr key={user.email} style={styles.row}>
                    <td style={styles.td}>{user.name || "Unnamed User"}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      <span style={styles.roleBadge(user.role)}>{user.role}</span>
                    </td>
                    <td style={styles.td}>
                      {user.role !== "superadmin" && (
                        <>
                          {user.role === "user" ? (
                            <button
                              style={styles.promote}
                              onClick={() => handlePromote(user.email)}
                            >
                              Promote
                            </button>
                          ) : (
                            <button
                              style={styles.demote}
                              onClick={() => handleDemote(user.email)}
                            >
                              Demote
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={styles.noData} colSpan="4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ */
/* EXPLORE PAGE STYLE UI */
/* ------------------------------ */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "60px 20px",
    background: "radial-gradient(circle at 25% 20%, #0f172a, #020617 80%)",
    display: "flex",
    justifyContent: "center",
    fontFamily: "'Poppins', sans-serif",
  },

  wrapper: {
    width: "100%",
    maxWidth: "1100px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "25px",
    padding: "35px",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  },

  title: {
    fontSize: "2.8rem",
    fontWeight: "700",
    textAlign: "center",
    background: "linear-gradient(90deg, #facc15, #fde047)",
    WebkitTextFillColor: "transparent",
    WebkitBackgroundClip: "text",
  },

  subtitle: {
    textAlign: "center",
    color: "#cbd5e1",
    marginBottom: "25px",
    fontSize: "1.1rem",
  },

  notification: {
    padding: "12px",
    background: "rgba(255,215,0,0.15)",
    borderRadius: "12px",
    color: "#fde047",
    textAlign: "center",
    marginBottom: "20px",
    fontWeight: "600",
  },

  filters: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  search: {
    flex: 1,
    padding: "14px 18px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.08)",
    border: "none",
    color: "#fff",
    outline: "none",
    fontSize: "1rem",
    backdropFilter: "blur(10px)",
    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)",
  },

  select: {
    padding: "14px 18px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.08)",
    border: "none",
    color: "#3675eaff",
    outline: "none",
    fontSize: "1rem",
    cursor: "pointer",
  },

  tableContainer: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    color: "#f1f5f9",
    fontSize: "1rem",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
  },

  row: {
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  td: {
    padding: "14px",
    color: "#e2e8f0",
    fontSize: "0.95rem",
  },

  roleBadge: (role) => ({
    padding: "6px 14px",
    borderRadius: "20px",
    color: "#fff",
    textTransform: "capitalize",
    fontSize: "0.8rem",
    background:
      role === "superadmin"
        ? "linear-gradient(90deg, #16a34a, #22c55e)"
        : role === "admin"
        ? "linear-gradient(90deg, #2563eb, #3b82f6)"
        : "linear-gradient(90deg, #64748b, #94a3b8)",
  }),

  promote: {
    padding: "8px 14px",
    background: "linear-gradient(90deg, #22c55e, #16a34a)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    marginRight: "8px",
  },

  demote: {
    padding: "8px 14px",
    background: "linear-gradient(90deg, #ef4444, #b91c1c)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#f87171",
  },

  loadingPage: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#020617",
  },

  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255,255,255,0.2)",
    borderTop: "5px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: "15px",
    color: "#fff",
    fontSize: "1.1rem",
  },
};

// Inject animation
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;
document.head.appendChild(styleSheet);

export default ManageRoles;
