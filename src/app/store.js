import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import restaurantReducer from "../features/restaurant/restaurantSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/order/orderSlice";
import paymentReducer from "../features/payment/paymentSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurant: restaurantReducer,
    cart: cartReducer,
    order: orderReducer,
    payment: paymentReducer,
  },
});

export default store;
