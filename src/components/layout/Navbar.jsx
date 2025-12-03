// src/components/layout/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-red-500">
          Tomato
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/admin/orders"
              className="text-sm text-gray-700 hover:text-red-500"
            >
              Admin Orders
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <Link
                to="/cart"
                className="text-sm text-gray-700 hover:text-red-500"
              >
                Cart
              </Link>
              <Link
                to="/orders"
                className="text-sm text-gray-700 hover:text-red-500"
              >
                My Orders
              </Link>
              <span className="text-sm text-gray-700">
                Hi, <span className="font-semibold">{user.name}</span>
              </span>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600 disabled:opacity-60"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1 rounded border border-red-500 text-red-500 text-sm hover:bg-red-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
