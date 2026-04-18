import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../features/cart/cartSlice";

const MenuItemCard = ({ item, restaurantId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { loading } = useSelector((s) => s.cart);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(
      addToCart({
        restaurantId,
        menuItemId: item._id,
        quantity: 1,
      })
    );
  };

  return (
    <div className="flex justify-between items-center bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`w-3 h-3 rounded-full border-2 inline-block ${
              item.isVeg
                ? "border-green-600 bg-green-500"
                : "border-red-600 bg-red-500"
            }`}
          />
          <h3 className="font-semibold text-gray-800">{item.name}</h3>
        </div>
        <p className="text-gray-500 text-sm mb-2">{item.description}</p>
        <p className="font-bold text-gray-800">₹{item.price}</p>
      </div>

    
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-28 h-24 object-cover rounded-lg"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-red-500 border border-red-500 px-4 py-1 rounded-lg text-sm font-semibold hover:bg-red-50 shadow-md whitespace-nowrap"
        >
          {loading ? "..." : "+ ADD"}
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;