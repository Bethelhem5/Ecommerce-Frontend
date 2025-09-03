import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Track selected sizes for each product
  const [selectedSizes, setSelectedSizes] = useState({});

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to fetch products", { variant: "error" });
    }
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = async (prod) => {
    try {
      // If product has sizes, require size selection
      if (prod.ProductSizes && prod.ProductSizes.length > 0) {
        const selectedSize = selectedSizes[prod.id];
        if (!selectedSize) {
          enqueueSnackbar("Please select a size first", { variant: "warning" });
          return;
        }
        await api.post("/cart/add", {
          productId: prod.id,
          quantity: 1,
          size: selectedSize,
        });
        enqueueSnackbar("Added to cart!", { variant: "success" });
        return;
      }
      // No sizes, add directly
      await api.post("/cart/add", {
        productId: prod.id,
        quantity: 1,
      });
      enqueueSnackbar("Added to cart!", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || "Failed to add to cart", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <h1 className="text-3xl font-bold mb-6 md:text-center sm:text-center lg:text-left">
          All Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded shadow p-4 flex flex-col justify-between"
            >
              <img
                src={`http://localhost:7777/uploads/${prod.image}`}
                alt={prod.name}
                className="h-40 w-full object-cover rounded mb-4"
              />
              <div>
                <h2 className="text-xl font-semibold">{prod.name}</h2>
                <p className="text-gray-600 mt-1">{prod.description}</p>
                <p className="mt-2 font-bold">Price: ${prod.price}</p>
                <p className="mt-1">Stock: {prod.stock}</p>
                {prod.ProductSizes && prod.ProductSizes.length > 0 && (
                  <div className="mt-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Size:
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={selectedSizes[prod.id] || ""}
                      onChange={(e) =>
                        handleSizeChange(prod.id, e.target.value)
                      }
                    >
                      <option value="">Select a size</option>
                      {prod.ProductSizes.map((s, i) => (
                        <option
                          key={s.id || `${prod.id}-${s.size}-${i}`}
                          value={s.size}
                        >
                          {s.size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg font-semibold shadow hover:bg-purple-700 transition duration-200 text-xs sm:text-sm"
                    onClick={() => handleAddToCart(prod)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="flex-1 bg-white border border-purple-600 text-purple-700 py-2 px-3 rounded-lg font-semibold shadow hover:bg-purple-50 transition duration-200 text-xs sm:text-sm"
                    onClick={() => {
                      /* View details logic here */
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
