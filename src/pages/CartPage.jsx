import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../features/cart/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading, error, isAuthIssue } = useSelector((s) => s.cart);
  const { isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold text-gray-600">
          Please login to view your cart
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading cart...</p>
      </div>
    );
  }

  if (isAuthIssue) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold text-gray-600">
          Session expired. Please login again.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Login
        </button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-semibold text-gray-600">
          🛒 Your cart is empty!
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  const handleQuantityChange = (itemId, newQty) => {
    dispatch(updateCartItem({ itemId, quantity: newQty }));
  };

  const handleRemove = (itemId) => {
    dispatch(removeCartItem({ itemId }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🛒 Your Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-red-500 border border-red-500 px-4 py-1 rounded-lg hover:bg-red-50 text-sm"
        >
          Clear Cart
        </button>
      </div>

      {error && (
        <p className="text-red-500 mb-4 text-sm">{error}</p>
      )}

      {/* Cart Items */}
      <div className="flex flex-col gap-4 mb-8">
        {cart.items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
              onError={(e) => (e.target.src = "/placeholder.png")}
            />

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {/* Veg/Non-veg indicator */}
                <span
                  className={`w-3 h-3 rounded-full border-2 inline-block ${
                    item.isVeg
                      ? "border-green-600 bg-green-500"
                      : "border-red-600 bg-red-500"
                  }`}
                />
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
              </div>
              <p className="text-gray-500 text-sm">
                ₹{item.price} per item
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold hover:bg-red-200 flex items-center justify-center"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold hover:bg-red-200 flex items-center justify-center"
              >
                +
              </button>
            </div>

            {/* Item Total */}
            <p className="font-bold text-gray-800 w-20 text-right">
              ₹{item.price * item.quantity}
            </p>

            {/* Remove */}
            <button
              onClick={() => handleRemove(item._id)}
              className="text-gray-400 hover:text-red-500 text-xl ml-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Subtotal</span>
          <span>₹{cart.subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Delivery fee</span>
          <span className="text-green-600">FREE</span>
        </div>
        <div className="border-t mt-3 pt-3 flex justify-between font-bold text-gray-800 text-lg">
          <span>Total</span>
          <span>₹{cart.subtotal}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full mt-6 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
};

export default CartPage;