export const loginWithGoogle = () => {
  const backendUrl = "https://d2z2es90bhnbzx.cloudfront.net";

  window.location.href = `${backendUrl}/api/auth/google`;
};
