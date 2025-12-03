// src/pages/MyOrdersPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../features/order/orderSlice";
import { Link } from "react-router-dom";

const statusColors = {
  PLACED: "bg-gray-200 text-gray-800",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-yellow-100 text-yellow-700",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const { myOrders, myOrdersLoading, myOrdersError } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div className="mt-4">
      <h1 className="text-lg font-semibold mb-3">My Orders</h1>

      {myOrdersLoading && <p>Loading your orders...</p>}
      {myOrdersError && (
        <p className="text-sm text-red-600 mb-2">{myOrdersError}</p>
      )}

      {!myOrdersLoading && myOrders.length === 0 && !myOrdersError && (
        <p className="text-sm text-gray-500">
          You haven&apos;t placed any orders yet.{" "}
          <Link to="/" className="text-red-500">
            Start ordering
          </Link>
        </p>
      )}

      <div className="space-y-3">
        {myOrders.map((order) => {
          const statusClass = statusColors[order.status] || "bg-gray-200";
          const createdDate = new Date(order.createdAt).toLocaleString();

          return (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-4 flex justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500">
                    #{order._id.slice(-6)}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${statusClass}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{createdDate}</p>
                <p className="text-sm font-semibold mb-1">
                  ₹{order.totalAmount} • {order.items?.length} items
                </p>
                <p className="text-xs text-gray-600">
                  Deliver to: {order.deliveryAddress?.label} -{" "}
                  {order.deliveryAddress?.city},{" "}
                  {order.deliveryAddress?.pincode}
                </p>
              </div>
              <div className="text-right text-xs text-gray-600 flex flex-col justify-between items-end gap-2">
                <div>
                  <p>Payment: {order.paymentInfo?.method}</p>
                  <p>Status: {order.paymentInfo?.status}</p>
                </div>
                <Link
                  to={`/orders/${order._id}/track`}
                  className="px-3 py-1 rounded-full border border-red-500 text-red-500 text-[11px] hover:bg-red-50"
                >
                  Track Order
                </Link>
              </div>

              {/* <div className="text-right text-xs text-gray-600 flex flex-col justify-between">
                <p>Payment: {order.paymentInfo?.method}</p>
                <p>Status: {order.paymentInfo?.status}</p>
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrdersPage;
