// src/pages/HomePage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchRestaurants } from "../features/restaurant/restaurantSlice";
import RestaurantCard from "../components/restaurant/RestaurantCard";

const HomePage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { list, listLoading, listError } = useSelector(
    (state) => state.restaurant
  );

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  return (
    <div className="mt-6">
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isAuthenticated ? `Welcome, ${user?.name}!` : "Welcome to Tomato 🍅"}
        </h1>
        <p className="text-sm text-gray-600">
          Order your favourite food from nearby restaurants. Browse menus, add
          items to cart and track your orders in real-time.
        </p>

        {!isAuthenticated && (
          <div className="mt-4 flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded bg-red-500 text-white text-sm hover:bg-red-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded border border-red-500 text-red-500 text-sm hover:bg-red-50"
            >
              Create an account
            </Link>
          </div>
        )}
      </div>

      {/* Later inga Restaurant list, filters, etc. add pannalam */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-1 text-gray-800">Fast Delivery 🚀</h2>
          <p className="text-xs text-gray-600">
            Get your food delivered hot and fresh from nearby restaurants.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-1 text-gray-800">
            Multiple Cuisines 🍛
          </h2>
          <p className="text-xs text-gray-600">
            South Indian, North Indian, Chinese and more at one place.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-1 text-gray-800">Easy Tracking 📦</h2>
          <p className="text-xs text-gray-600">
            Track your orders from placed to delivered in real-time.
          </p>
        </div>
      </div>
      {/* Restaurant List */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Restaurants near you</h2>
      </div>

      {listLoading && <p>Loading restaurants...</p>}
      {listError && <p className="text-sm text-red-600 mb-2">{listError}</p>}

      <div className="grid gap-4 md:grid-cols-3">
        {list.map((r) => (
          <RestaurantCard key={r._id} restaurant={r} />
        ))}
      </div>

      {!listLoading && list.length === 0 && !listError && (
        <p className="text-sm text-gray-500 mt-4">
          No restaurants found. Please add some from admin / Postman.
        </p>
      )}
    </div>
  );
};

export default HomePage;
