export const loginWithGoogle = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  console.log("Backend URL:", backendUrl);

  window.location.href = `${backendUrl}/api/auth/google`;
};
