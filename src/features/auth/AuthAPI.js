export const loginWithGoogle = () => {
  const backendUrl ="https://tomato-5fkk.onrender.com";

  window.location.href = `${backendUrl}/api/auth/google`;
};

// import.meta.env.VITE_BACKEND_URL ||http://localhost:5001
