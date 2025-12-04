// src/pages/PaymentSuccessPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { confirmStripeOrder } from "../features/payment/paymentSlice";
import { fetchCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

const PaymentSuccessPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { confirmLoading, confirmError } = useSelector(
    (state) => state.payment
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [address, setAddress] = useState({
    label: "Online Payment Address",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  // Optional: You may want to store last used address in localStorage & restore here.

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleConfirm = async (e) => {
    e.preventDefault();

    if (!address.street || !address.city || !address.pincode) {
      alert("Please fill street, city and pincode");
      return;
    }

    try {
      const resultAction = await dispatch(
        confirmStripeOrder({ deliveryAddress: address })
      ).unwrap();

      // cart refresh
      dispatch(fetchCart());

      // navigate to normal order-success page using new order id
      navigate(`/order-success/${resultAction._id}`, { replace: true });
    } catch (err) {
      console.error("Confirm Stripe order failed:", err);
    }
  };

  return (
    <div className="mt-10 max-w-md mx-auto bg-white rounded-xl shadow p-6">
      <h1 className="text-lg font-semibold mb-2 text-center">
        Payment Successful! 🎉
      </h1>
      <p className="text-xs text-gray-600 mb-4 text-center">
        Now we need your delivery address to complete the order.
      </p>

      {confirmError && (
        <p className="text-sm text-red-600 mb-2 text-center">{confirmError}</p>
      )}

      <form onSubmit={handleConfirm} className="space-y-3">
        <div>
          <label className="block text-xs mb-1">Street</label>
          <input
            type="text"
            name="street"
            value={address.street}
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, street: e.target.value }))
            }
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs mb-1">City</label>
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, city: e.target.value }))
              }
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs mb-1">State</label>
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, state: e.target.value }))
              }
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs mb-1">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={address.pincode}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, pincode: e.target.value }))
              }
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Landmark</label>
            <input
              type="text"
              name="landmark"
              value={address.landmark}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, landmark: e.target.value }))
              }
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={confirmLoading}
          className="w-full bg-red-500 text-white py-2 rounded text-sm hover:bg-red-600 disabled:opacity-60"
        >
          {confirmLoading ? "Confirming order..." : "Confirm Order"}
        </button>
      </form>
    </div>
  );
};

export default PaymentSuccessPage;
