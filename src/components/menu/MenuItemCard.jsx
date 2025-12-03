// src/components/menu/MenuItemCard.jsx
import React from "react";

const MenuItemCard = ({ item, onAddToCart, adding }) => {
  return (
    <div className="flex justify-between items-start bg-white rounded-lg shadow-sm p-3 mb-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`h-3 w-3 border rounded-sm ${
              item.isVeg ? "border-green-600" : "border-red-600"
            } flex items-center justify-center`}
          >
            <span
              className={`h-2 w-2 rounded-sm ${
                item.isVeg ? "bg-green-600" : "bg-red-600"
              }`}
            ></span>
          </span>
          <h4 className="font-semibold text-sm">{item.name}</h4>
        </div>
        <p className="text-xs text-gray-600 mb-1">
          ₹{item.price} • {item.category}
        </p>
        {item.description && (
          <p className="text-[11px] text-gray-500 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-md"
          />
        )}
        <button
          onClick={onAddToCart}
          disabled={adding}
          className="px-3 py-1 rounded-full border border-red-500 text-red-500 text-xs hover:bg-red-50 disabled:opacity-60"
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
