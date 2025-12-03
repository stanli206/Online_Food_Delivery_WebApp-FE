// src/pages/RestaurantListPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurants } from "../features/restaurant/restaurantSlice";
import RestaurantCard from "../components/restaurant/RestaurantCard";

const RestaurantListPage = () => {
  const dispatch = useDispatch();
  const { list, listLoading, listError } = useSelector(
    (state) => state.restaurant
  );

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-3">Restaurants near you</h2>

      {listLoading && <p>Loading restaurants...</p>}
      {listError && (
        <p className="text-sm text-red-600 mb-2">{listError}</p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {list.map((r) => (
          <RestaurantCard key={r._id} restaurant={r} />
        ))}
      </div>

      {!listLoading && list.length === 0 && !listError && (
        <p className="text-sm text-gray-500 mt-4">
          No restaurants found. Please add some from admin panel.
        </p>
      )}
    </div>
  );
};

export default RestaurantListPage;
