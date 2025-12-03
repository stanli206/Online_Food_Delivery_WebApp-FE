// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../features/auth/authSlice";
import { loginWithGoogle } from "../features/auth/AuthAPI";
import { useLocation, useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({ email: "", password: "" });

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    dispatch(loginUser(form));
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>

      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 text-white py-2 rounded text-sm hover:bg-red-600 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="my-4 flex items-center">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="px-2 text-xs text-gray-500">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        onClick={loginWithGoogle}
        className="w-full border border-gray-300 py-2 rounded text-sm hover:bg-gray-50 flex items-center justify-center gap-2"
      >
        <span>Continue with Google</span>
      </button>

      <p className="mt-4 text-xs text-center text-gray-600">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-red-500">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
