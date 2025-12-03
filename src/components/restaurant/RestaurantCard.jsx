// src/components/restaurant/RestaurantCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurants/${restaurant._id}`}
      className="bg-white rounded-xl shadow hover:shadow-md transition block"
    >
      <div className="h-36 w-full overflow-hidden rounded-t-xl bg-gray-100">
        {restaurant.image ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm mb-1">{restaurant.name}</h3>
        <p className="text-xs text-gray-600 line-clamp-2 mb-1">
          {restaurant.cuisines?.join(", ")}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>⭐ {restaurant.rating?.toFixed?.(1) || "New"}</span>
          <span>{restaurant.deliveryTime || 30} mins</span>
        </div>
        <p className="mt-1 text-[11px] text-gray-400">
          {restaurant.address?.city}, {restaurant.address?.pincode}
        </p>
      </div>
    </Link>
  );
};

export default RestaurantCard;
