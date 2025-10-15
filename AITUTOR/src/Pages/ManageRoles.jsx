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
      <div style={styles.page}>
        <h2 style={{ color: "#ccc" }}>Loading users...</h2>
      </div>
    );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
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
  <option value="all" style={styles.option}>All Roles</option>
  <option value="user" style={styles.option}>User</option>
  <option value="admin" style={styles.option}>Admin</option>
  <option value="superadmin" style={styles.option}>Superadmin</option>
</select>

        </div>

        <div style={styles.tableWrapper}>
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
                      <span style={styles.role(user.role)}>{user.role}</span>
                    </td>
                    <td style={styles.td}>
                      {user.role !== "superadmin" && (
                        <>
                          {user.role === "user" ? (
                            <button
                              style={styles.promoteBtn}
                              onClick={() => handlePromote(user.email)}
                            >
                              Promote
                            </button>
                          ) : (
                            <button
                              style={styles.demoteBtn}
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
                  <td colSpan="4" style={styles.noData}>
                    No users found
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

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0c111b, #1b2430)",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "'Poppins', sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "900px",
    background: "rgba(255,255,255,0.05)",
    padding: "30px",
    borderRadius: "20px",
    backdropFilter: "blur(15px)",
    boxShadow: "0 15px 35px rgba(0,0,0,0.6)",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  title: {
    fontSize: "2rem",
    color: "#fef9f3",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "10px",
  },
  note: {
    textAlign: "center",
    color: "#9ca3af",
    marginBottom: "20px",
  },
  notification: {
    color: "#ffd700",
    background: "rgba(255,215,0,0.1)",
    padding: "8px 12px",
    borderRadius: "10px",
    textAlign: "center",
    marginBottom: "15px",
    fontWeight: "500",
  },
  filters: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
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
  outline: "none",
  fontSize: "1rem",
  cursor: "pointer",
  // Force dropdown text to be visible
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
},
option: {
  backgroundColor: "#1b2430", // dark background
  color: "#fef9f3",           // light text
  padding: "8px 12px",
},


tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "12px 15px",
    color: "#fef9f3",
    borderBottom: "2px solid rgba(255,255,255,0.2)",
    fontSize: "0.95rem",
  },
  row: {
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    transition: "background 0.3s",
  },
  td: {
    padding: "12px 15px",
    color: "#f1f5f9",
    fontSize: "0.9rem",
  },
  role: (role) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    textTransform: "capitalize",
    background:
      role === "superadmin"
        ? "#16a34a"
        : role === "admin"
        ? "#3b82f6"
        : "#64748b",
    color: "#fff",
  }),
  promoteBtn: {
    background: "#22c55e",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "500",
    marginRight: "5px",
    transition: "all 0.2s",
  },
  demoteBtn: {
    background: "#ef4444",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  noData: {
    textAlign: "center",
    padding: "15px",
    color: "#f87171",
  },
};

export default ManageRoles;
