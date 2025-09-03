import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import api from "../../../services/api";

const CartDetails = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCartProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/cart/");
      setItems(
        Array.isArray(res.data.cart?.CartItems) ? res.data.cart.CartItems : []
      );
    } catch (err) {
      setError(err.message || "Failed to load cart");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  const handleRemove = async (cartItemId) => {
    try {
      await api.delete(`/cart/item/${cartItemId}`);
      fetchCartProducts();
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  const handleQuantityChange = async (cartItemId, stock, value) => {
    let newQty = Number(value);
    if (newQty > stock) newQty = stock;
    if (newQty < 1) newQty = 1;
    try {
      await api.put(`/cart/item/${cartItemId}`, { quantity: newQty });
      fetchCartProducts();
    } catch (err) {
      setError("Failed to update quantity");
    }
  };

  const handleSizeChange = async (cartItemId, newSize) => {
    try {
      await api.put(`/cart/item/${cartItemId}/size`, { size: newSize });
      fetchCartProducts();
    } catch (err) {
      setError("Failed to update size");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-purple-700 text-center">
          Cart Details
        </h1>
        {loading ? (
          <div className="text-center">Loading cart...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500">Your cart is empty.</div>
        ) : (
          <div className="space-y-6">
            {items.map((item, idx) => (
              <div
                key={item.cart_item_id || idx}
                className="bg-white rounded-xl shadow p-4 flex gap-4 items-center"
              >
                <img
                  src={`http://localhost:7777/uploads/${item.Product?.image}`}
                  alt={item.Product?.name}
                  className="h-20 w-20 object-cover rounded border"
                />
                <div className="flex-1">
                  <h2 className="font-bold text-lg text-purple-700">
                    {item.Product?.name}
                  </h2>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-600 flex-1 mr-4">
                      {item.Product?.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`qty-${idx}`}
                        className="text-sm text-gray-600"
                      >
                        Qty:
                      </label>
                      <input
                        id={`qty-${idx}`}
                        type="number"
                        min={1}
                        max={item.Product?.stock}
                        value={item.quantity || 1}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.cart_item_id,
                            item.Product?.stock,
                            e.target.value
                          )
                        }
                        className="w-16 border rounded px-2 py-1"
                      />
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        onClick={() => handleRemove(item.cart_item_id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-green-700 font-bold">
                    ${item.Product?.price}
                  </p>
                  <p className="text-gray-700">Stock: {item.Product?.stock}</p>
                  {item.size && (
                    <p className="text-gray-500">Size: {item.size}</p>
                  )}
                  {item.Product?.ProductSizes &&
                    item.Product.ProductSizes.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <label
                          htmlFor={`size-${idx}`}
                          className="text-sm text-gray-600"
                        >
                          Size:
                        </label>
                        <select
                          id={`size-${idx}`}
                          value={item.size || ""}
                          onChange={(e) =>
                            handleSizeChange(item.cart_item_id, e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        >
                          {item.Product.ProductSizes.map((s, i) => (
                            <option
                              key={s.id || `${item.Product.id}-${s.size}-${i}`}
                              value={s.size}
                            >
                              {s.size}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CartDetails;
