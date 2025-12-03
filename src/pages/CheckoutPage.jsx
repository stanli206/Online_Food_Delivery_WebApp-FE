// src/pages/CheckoutPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, clearOrderError } from "../features/order/orderSlice";
import { fetchCart } from "../features/cart/cartSlice";
import { useNavigate, Link } from "react-router-dom";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, loading: cartLoading } = useSelector((state) => state.cart);
  const { creating, createError, lastCreatedOrder } = useSelector(
    (state) => state.order
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [address, setAddress] = useState({
    label: "Home",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Ensure user is logged in & cart loaded
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated, navigate]);

  // If cart empty → redirect to /cart
  useEffect(() => {
    if (!cartLoading && (!cart || !cart.items || cart.items.length === 0)) {
      // Only run after initial fetch
      if (!cartLoading) {
        navigate("/cart");
      }
    }
  }, [cart, cartLoading, navigate]);

  // If order created successfully → go to success page
  useEffect(() => {
    if (lastCreatedOrder && lastCreatedOrder._id) {
      navigate(`/order-success/${lastCreatedOrder._id}`, { replace: true });
    }
  }, [lastCreatedOrder, navigate]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    dispatch(clearOrderError());

    // minimal validation
    if (!address.street || !address.city || !address.pincode) {
      alert("Please fill street, city and pincode");
      return;
    }

    try {
      await dispatch(
        createOrder({
          deliveryAddress: address,
          paymentMethod,
        })
      ).unwrap();
      // success handled by useEffect (navigate)
    } catch (err) {
      console.error("Order failed:", err);
    }
  };

  if (cartLoading) {
    return <p className="mt-4">Loading checkout...</p>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-2">
          Your cart is empty. Add some items first.
        </p>
        <Link to="/" className="text-red-500 text-sm">
          Go to home
        </Link>
      </div>
    );
  }

  const totalToPay = cart.subtotal + 30; // same as CartPage

  return (
    <div className="mt-4 grid md:grid-cols-[2fr,1fr] gap-4">
      {/* Address form */}
      <div className="bg-white rounded-xl shadow p-4">
        <h1 className="text-lg font-semibold mb-3">Delivery Address</h1>

        {createError && (
          <p className="text-sm text-red-600 mb-2">{createError}</p>
        )}

        <form onSubmit={handlePlaceOrder} className="space-y-3">
          <div>
            <label className="block text-xs mb-1">Label</label>
            <input
              type="text"
              name="label"
              value={address.label}
              onChange={handleAddressChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Home / Office"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Street</label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleAddressChange}
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
                onChange={handleAddressChange}
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
                onChange={handleAddressChange}
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
                onChange={handleAddressChange}
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
                onChange={handleAddressChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-1">Payment method</h2>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              <span>Cash on Delivery</span>
            </label>
            {/* later online payment options add panna mudiyum */}
          </div>

          <button
            type="submit"
            disabled={creating}
            className="mt-3 w-full bg-red-500 text-white py-2 rounded text-sm hover:bg-red-600 disabled:opacity-60"
          >
            {creating ? "Placing order..." : `Place Order (₹${totalToPay})`}
          </button>
        </form>
      </div>

      {/* Order summary (read from cart) */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3 text-sm">Order Summary</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="flex justify-between text-xs text-gray-700"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 border-t pt-2 text-sm">
          <div className="flex justify-between">
            <span>Item total</span>
            <span>₹{cart.subtotal}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Delivery fee</span>
            <span>₹30</span>
          </div>
          <div className="flex justify-between font-semibold mt-2">
            <span>To pay</span>
            <span>₹{totalToPay}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
