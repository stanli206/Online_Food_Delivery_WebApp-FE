// src/pages/OAuthSuccessPage.jsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const OAuthSuccessPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const resultAction = await dispatch(fetchCurrentUser());
      // success or fail both la, just go home or login
      if (fetchCurrentUser.fulfilled.match(resultAction)) {
        navigate("/", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    };
    init();
  }, [dispatch, navigate]);

  return (
    <div className="h-[70vh] flex flex-col items-center justify-center">
      <p className="text-lg mb-2">Finishing Google login...</p>
      <p className="text-sm text-gray-500">Please wait a moment.</p>
    </div>
  );
};

export default OAuthSuccessPage;
