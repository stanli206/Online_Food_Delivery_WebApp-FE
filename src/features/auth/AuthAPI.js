export const loginWithGoogle = () => {
  const backendUrl = "https://tomato-43cn.onrender.com";//http://localhost:5001

  window.location.href = `${backendUrl}/api/auth/google`;
};
