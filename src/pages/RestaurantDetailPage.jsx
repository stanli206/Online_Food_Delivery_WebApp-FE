// src/pages/RestaurantDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRestaurantDetails,
  fetchRestaurantMenu,
} from "../features/restaurant/restaurantSlice";
import { addToCart } from "../features/cart/cartSlice";
import MenuItemCard from "../components/menu/MenuItemCard";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedRestaurant, detailLoading, detailError, menuItems, menuLoading, menuError } =
    useSelector((state) => state.restaurant);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading: cartLoading, error: cartError, isAuthIssue } = useSelector(
    (state) => state.cart
  );

  const [addingItemId, setAddingItemId] = useState(null);

  useEffect(() => {
    dispatch(fetchRestaurantDetails(id));
    dispatch(fetchRestaurantMenu(id));
  }, [dispatch, id]);

  const handleAddToCart = (itemId) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/restaurants/${id}` } } });
      return;
    }

    setAddingItemId(itemId);
    dispatch(
      addToCart({
        restaurantId: id,
        menuItemId: itemId,
        quantity: 1,
      })
    ).finally(() => {
      setAddingItemId(null);
    });
  };

  if (detailLoading) return <p className="mt-4">Loading restaurant...</p>;
  if (detailError)
    return <p className="mt-4 text-sm text-red-600">{detailError}</p>;
  if (!selectedRestaurant)
    return <p className="mt-4 text-sm text-gray-500">Restaurant not found.</p>;

  return (
    <div className="mt-4">
      <div className="bg-white rounded-xl shadow p-4 mb-4 flex justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold mb-1">
            {selectedRestaurant.name}
          </h1>
          <p className="text-sm text-gray-600 mb-1">
            {selectedRestaurant.cuisines?.join(", ")}
          </p>
          <p className="text-xs text-gray-500">
            {selectedRestaurant.address?.street},{" "}
            {selectedRestaurant.address?.city}{" "}
            {selectedRestaurant.address?.pincode}
          </p>
          <div className="flex gap-4 mt-2 text-xs text-gray-600">
            <span>⭐ {selectedRestaurant.rating?.toFixed?.(1) || "New"}</span>
            <span>{selectedRestaurant.deliveryTime || 30} mins</span>
          </div>
        </div>
        {selectedRestaurant.image && (
          <img
            src={selectedRestaurant.image}
            alt={selectedRestaurant.name}
            className="w-32 h-24 object-cover rounded-md"
          />
        )}
      </div>

      {cartError && (
        <p className="text-xs text-red-600 mb-2">{cartError}</p>
      )}
      {isAuthIssue && (
        <p className="text-xs text-red-500 mb-2">
          Please <Link to="/login" className="underline">login</Link> to add items to cart.
        </p>
      )}

      <h2 className="text-lg font-semibold mb-2">Menu</h2>
      {menuLoading && <p>Loading menu...</p>}
      {menuError && (
        <p className="text-sm text-red-600 mb-2">{menuError}</p>
      )}

      <div>
        {menuItems.map((item) => (
          <MenuItemCard
            key={item._id}
            item={item}
            onAddToCart={() => handleAddToCart(item._id)}
            adding={cartLoading && addingItemId === item._id}
          />
        ))}
      </div>

      {!menuLoading && menuItems.length === 0 && !menuError && (
        <p className="text-sm text-gray-500 mt-2">
          No menu items found for this restaurant.
        </p>
      )}
    </div>
  );
};

export default RestaurantDetailPage;
