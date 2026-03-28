import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../features/auth/authSlice";

const OAuthSuccessPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      dispatch(loginSuccess(token));
      navigate("/", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div className="h-[70vh] flex flex-col items-center justify-center">
      <p className="text-lg mb-2">Finishing Google login...</p>
      <p className="text-sm text-gray-500">Please wait a moment.</p>
    </div>
  );
};

export default OAuthSuccessPage;
