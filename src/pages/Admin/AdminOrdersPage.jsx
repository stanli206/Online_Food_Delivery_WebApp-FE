// src/pages/Admin/AdminOrdersPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersAdmin,
  updateOrderStatusAdmin,
  clearOrderError,
} from "../../features/order/orderSlice";

const statusOptions = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const statusColor = (status) => {
  switch (status) {
    case "PLACED":
      return "bg-gray-100 text-gray-700";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";
    case "PREPARING":
      return "bg-yellow-100 text-yellow-700";
    case "OUT_FOR_DELIVERY":
      return "bg-purple-100 text-purple-700";
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const {
    adminOrders,
    adminOrdersLoading,
    adminOrdersError,
    updatingStatus,
    updateStatusError,
  } = useSelector((state) => state.order);

  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    dispatch(fetchAllOrdersAdmin());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatusAdmin({ orderId, status: newStatus }));
  };

  const filteredOrders =
    filterStatus === "ALL"
      ? adminOrders
      : adminOrders.filter((o) => o.status === filterStatus);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-semibold">Admin – All Orders</h1>

        <div className="flex items-center gap-2 text-sm">
          <span>Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-2 py-1 text-xs"
          >
            <option value="ALL">All</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            onClick={() => dispatch(fetchAllOrdersAdmin())}
            className="text-xs border px-2 py-1 rounded hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {adminOrdersLoading && <p>Loading all orders...</p>}
      {adminOrdersError && (
        <p className="text-sm text-red-600 mb-2">{adminOrdersError}</p>
      )}
      {updateStatusError && (
        <p className="text-sm text-red-600 mb-2">{updateStatusError}</p>
      )}

      {!adminOrdersLoading &&
        filteredOrders.length === 0 &&
        !adminOrdersError && (
          <p className="text-sm text-gray-500">No orders found.</p>
        )}

      <div className="space-y-3">
        {filteredOrders.map((order) => {
          const shortId = order._id.slice(-6);
          const created = new Date(order.createdAt).toLocaleString();

          return (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left: basic info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500">#{shortId}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${statusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{created}</p>
                <p className="text-sm font-semibold mb-1">
                  ₹{order.totalAmount} • {order.items?.length} items
                </p>
                <p className="text-xs text-gray-600 mb-1">
                  User: {order.userId?.name} ({order.userId?.email})
                </p>
                <p className="text-xs text-gray-600">
                  Restaurant: {order.restaurantId?.name}
                </p>
              </div>

              {/* Middle: address */}
              <div className="text-xs text-gray-600 flex-1">
                <p className="font-semibold mb-1">Delivery Address</p>
                <p>{order.deliveryAddress?.label}</p>
                <p>{order.deliveryAddress?.street}</p>
                <p>
                  {order.deliveryAddress?.city}{" "}
                  {order.deliveryAddress?.pincode}
                </p>
                <p>{order.deliveryAddress?.landmark}</p>
              </div>

              {/* Right: actions */}
              <div className="text-xs text-gray-700 flex flex-col gap-2 min-w-[180px]">
                <div>
                  <p className="font-semibold mb-1">Update Status</p>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    disabled={updatingStatus}
                    className="w-full border rounded px-2 py-1 text-xs"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="font-semibold mb-1">Payment</p>
                  <p>Method: {order.paymentInfo?.method}</p>
                  <p>Status: {order.paymentInfo?.status}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
