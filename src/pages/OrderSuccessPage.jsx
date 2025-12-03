// src/pages/OrderSuccessPage.jsx
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearLastCreatedOrder } from "../features/order/orderSlice";
import { fetchCart } from "../features/cart/cartSlice";

const OrderSuccessPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // ensure cart is refreshed (should be empty now)
  useEffect(() => {
    dispatch(fetchCart());
    dispatch(clearLastCreatedOrder());
  }, [dispatch]);

  return (
    <div className="mt-10 max-w-md mx-auto bg-white rounded-xl shadow p-6 text-center">
      <div className="text-4xl mb-3">✅</div>
      <h1 className="text-xl font-semibold mb-2">Order Placed Successfully!</h1>
      <p className="text-sm text-gray-600 mb-4">
        Your order ID is{" "}
        <span className="font-mono text-gray-800">{id}</span>.
      </p>
      <div className="flex flex-col gap-2">
        <Link
          to="/orders"
          className="w-full bg-red-500 text-white py-2 rounded text-sm hover:bg-red-600"
        >
          View My Orders
        </Link>
        <Link
          to="/"
          className="w-full border border-gray-300 py-2 rounded text-sm hover:bg-gray-50"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
