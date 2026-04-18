import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../app/api";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      const sessionId = new URLSearchParams(location.search).get("session_id");

      if (!sessionId) return;

      try {
        const res = await api.get(
          `/api/payments/verify?session_id=${sessionId}`,
        );

        if (res.data.success) {
          navigate("/my-orders");
        } else {
          navigate("/payment-failed");
        }
      } catch (err) {
        console.error("VERIFY ERROR:", err);
        navigate("/payment-failed");
      }
    };

    verify();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Verifying payment...</p>
    </div>
  );
};

export default PaymentSuccessPage;
