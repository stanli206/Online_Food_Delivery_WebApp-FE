export const loginWithGoogle = () => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  window.location.href = `${backendUrl}/api/auth/google`;
};
