export const loginWithGoogle = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL; 
  window.location.href = `${backendUrl}/api/auth/google`;
};