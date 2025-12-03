import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchOrderById } from "../features/order/orderSlice";

const STATUS_STEPS = [
  { key: "PLACED", label: "Order Placed" },
  { key: "CONFIRMED", label: "Restaurant Confirmed" },
  { key: "PREPARING", label: "Preparing your food" },
  { key: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

const OrderTrackingPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedOrder, selectedOrderLoading, selectedOrderError } =
    useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  if (selectedOrderLoading) {
    return <p className="mt-4">Loading order details...</p>;
  }

  if (selectedOrderError) {
    return (
      <div className="mt-4">
        <p className="text-sm text-red-600 mb-2">{selectedOrderError}</p>
        <Link to="/orders" className="text-sm text-red-500">
          Back to My Orders
        </Link>
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-2">Order not found.</p>
        <Link to="/orders" className="text-sm text-red-500">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const currentStatus = selectedOrder.status;
  const isCancelled = currentStatus === "CANCELLED";
  const created = new Date(selectedOrder.createdAt).toLocaleString();

  const currentIndex =
    STATUS_STEPS.findIndex((s) => s.key === currentStatus) ??
    STATUS_STEPS.length - 1;

  return (
    <div className="mt-4 max-w-3xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold mb-1">Order Tracking</h1>
          <p className="text-xs text-gray-600">
            Order ID: <span className="font-mono">{selectedOrder._id}</span>
          </p>
          <p className="text-[11px] text-gray-500">Placed at: {created}</p>
        </div>
        <div className="text-right text-xs text-gray-600">
          <p>Restaurant: {selectedOrder.restaurantId?.name}</p>
          <p>
            Amount:{" "}
            <span className="font-semibold">₹{selectedOrder.totalAmount}</span>
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <h2 className="text-sm font-semibold mb-3">Delivery Status</h2>

        {isCancelled ? (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
            This order has been <span className="font-semibold">CANCELLED</span>
            .
          </div>
        ) : (
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-[10px] top-0 bottom-0 w-[2px] bg-gray-200" />

            <div className="space-y-4">
              {STATUS_STEPS.map((step, index) => {
                const reached = index <= currentIndex;
                const isCurrent = index === currentIndex;

                return (
                  <div key={step.key} className="flex items-start gap-3">
                    {/* dot */}
                    <div className="relative z-10">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          reached
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {reached && (
                          <span className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>

                    <div>
                      <p
                        className={`text-sm font-medium ${
                          reached ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && !isCancelled && (
                        <p className="text-xs text-gray-500">
                          Current status: {step.label}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Items + address */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm font-semibold mb-2">Items</h2>
          <div className="space-y-1 max-h-56 overflow-y-auto text-xs text-gray-700">
            {selectedOrder.items?.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 text-xs text-gray-700">
          <h2 className="text-sm font-semibold mb-2">Delivery Details</h2>
          <p className="mb-1">
            Deliver to: {selectedOrder.deliveryAddress?.label}
          </p>
          <p>{selectedOrder.deliveryAddress?.street}</p>
          <p>
            {selectedOrder.deliveryAddress?.city}{" "}
            {selectedOrder.deliveryAddress?.pincode}
          </p>
          {selectedOrder.deliveryAddress?.landmark && (
            <p>Landmark: {selectedOrder.deliveryAddress?.landmark}</p>
          )}
          <div className="mt-3">
            <p>
              Payment: {selectedOrder.paymentInfo?.method} (
              {selectedOrder.paymentInfo?.status})
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between text-sm">
        <Link to="/orders" className="text-red-500">
          ← Back to My Orders
        </Link>
        <Link to="/" className="text-gray-600">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
