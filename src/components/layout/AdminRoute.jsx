// src/components/layout/AdminRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, initialized } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <Navigate
        to="/"
        state={{ from: location, error: "Admin access only" }}
        replace
      />
    );
  }

  return children;
};

export default AdminRoute;
