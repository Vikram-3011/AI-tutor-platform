// ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{   display: "flex", height: "100vh", color: "#165fccff", background: "radial-gradient( #0f172a, #020617)" }}>
       
      </div>
    );
  }

  if (!user) return <Navigate to="/signin" replace />;

  return children;
}
