import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = "http://localhost:7777/api";
const IMAGE_BASE = "http://localhost:7777/uploads";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  // Load cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_BASE}/cart`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setCart(data.cart || { CartItems: [] });
      } catch (err) {
        console.error("Error loading cart:", err);
      }
    };
    fetchCart();
  }, []);

  const handleCancel = async (cartItemId) => {
    if (!window.confirm("Are you sure you want to remove this item from your cart?")) return;
    try {
      const res = await fetch(`${API_BASE}/cart/remove/${cartItemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to remove item");
      }
      setCart((prev) => ({
        ...prev,
        CartItems: prev.CartItems.filter((i) => i.cart_item_id !== cartItemId),
      }));
    } catch (err) {
      console.error("Remove error:", err);
      alert(err.message || "Error removing item from cart");
    }
  };

  const handleQuantityChange = async (cartItemId, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await fetch(`${API_BASE}/cart/update/${cartItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update quantity");
      }
      setCart((prev) => ({
        ...prev,
        CartItems: prev.CartItems.map((i) =>
          i.cart_item_id === cartItemId ? { ...i, quantity: newQty } : i
        ),
      }));
    } catch (err) {
      console.error("Quantity update error:", err);
      alert(err.message || "Error updating quantity");
    }
  };

  const getImageUrl = (filename) => {
    if (!filename) return "/placeholder.png";
    return `${IMAGE_BASE}/${filename}`;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800 text-center sm:text-left">
        Cart
      </h1>

      {!cart || cart.CartItems?.length === 0 ? (
        <div className="text-gray-500 text-lg sm:text-xl text-center mt-12">
          Your cart is empty.
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.CartItems.map((item) => (
              <li
                key={item.cart_item_id}
                className="bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center"
              >
                {/* Product Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full sm:w-auto">
                  <img
                    src={item.Product.imageUrl || getImageUrl(item.Product.image)}
                    alt={item.Product.name}
                    className="h-24 w-24 sm:h-32 sm:w-32 object-contain"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                  <div className="flex flex-col gap-2 w-full sm:w-auto text-center sm:text-left">
                    <span className="font-semibold text-gray-800 text-lg sm:text-xl">
                      {item.Product.name}
                    </span>
                    <span className="text-gray-500 text-sm sm:text-base">
                      ETB {item.Product.price}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex justify-center sm:justify-start items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.cart_item_id, item.quantity - 1)
                        }
                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        -
                      </button>
                      <span className="text-gray-700 font-medium px-2">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.cart_item_id, item.quantity + 1)
                        }
                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cancel button */}
                <button
                  onClick={() => handleCancel(item.cart_item_id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mt-4 sm:mt-0 sm:ml-4 w-full sm:w-auto"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* Checkout Button */}
          <Link
            to="/order"
            className="block mt-6 sm:mt-8 bg-gray-800 text-white font-semibold text-center px-6 py-3 rounded hover:bg-gray-900 w-full sm:w-auto mx-auto"
          >
            Checkout
          </Link>
        </>
      )}
    </div>
  );
};

export default Cart;
