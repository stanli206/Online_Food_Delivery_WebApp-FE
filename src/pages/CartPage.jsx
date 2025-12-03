// src/pages/CartPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../features/cart/cartSlice";
import { useNavigate, Link } from "react-router-dom";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading, error, isAuthIssue } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    } else {
      navigate("/login", { state: { from: { pathname: "/cart" } } });
    }
  }, [dispatch, isAuthenticated, navigate]);

  const handleQuantityChange = (itemId, quantity) => {
    dispatch(updateCartItem({ itemId, quantity }));
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeCartItem({ itemId }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    // Later: navigate to checkout page
    navigate("/checkout");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mt-4">
      <h1 className="text-lg font-semibold mb-3">Your Cart</h1>

      {loading && <p>Loading cart...</p>}
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      {isAuthIssue && (
        <p className="text-xs text-red-500 mb-2">
          Please <Link to="/login" className="underline">login</Link> to use cart.
        </p>
      )}

      {!loading && (!cart || !cart.items || cart.items.length === 0) && (
        <p className="text-sm text-gray-500">
          Your cart is empty.{" "}
          <Link to="/" className="text-red-500">
            Browse restaurants
          </Link>
        </p>
      )}

      {cart && cart.items && cart.items.length > 0 && (
        <div className="grid md:grid-cols-[2fr,1fr] gap-4">
          {/* Items */}
          <div className="bg-white rounded-xl shadow p-4">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b last:border-b-0 py-3"
              >
                <div>
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  <p className="text-xs text-gray-600">
                    ₹{item.price} × {item.quantity} = ₹
                    {item.price * item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity - 1)
                    }
                    className="w-7 h-7 rounded-full border flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <span className="text-sm w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity + 1)
                    }
                    className="w-7 h-7 rounded-full border flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-xs text-red-500 ml-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow p-4 flex flex-col justify-between">
            <div>
              <h2 className="font-semibold mb-2 text-sm">Bill Details</h2>
              <div className="flex justify-between text-sm mb-1">
                <span>Item total</span>
                <span>₹{cart.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Delivery fee</span>
                <span>₹30</span>
              </div>
              <div className="flex justify-between font-semibold text-sm mt-2 border-t pt-2">
                <span>To pay</span>
                <span>₹{cart.subtotal + 30}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={handleCheckout}
                className="w-full bg-red-500 text-white py-2 rounded text-sm hover:bg-red-600"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={handleClearCart}
                className="w-full border border-gray-300 py-2 rounded text-xs hover:bg-gray-50"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
