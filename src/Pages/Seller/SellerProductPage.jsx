import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../../../services/api";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const SellerProducts = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const sellerId = parseInt(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo")).user_id
      : 0
  );

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["seller-products", sellerId],
    queryFn: async () => {
      try {
        const res = await api.get("/products");
        return res.data.products.filter((p) => p.seller_id === sellerId);
      } catch (err) {
        enqueueSnackbar("Failed to fetch products", { variant: "error" });
        return [];
      }
    },
  });

  const handleDelete = (id) => {
    // Navigate to DeleteMessage page with product ID
    navigate(`/delete-product/${id}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 md:text-center sm:text-center lg:text-left">
        My Products
      </h1>
      {isLoading ? (
        <div className="text-center text-gray-500">Loading products...</div>
      ) : error ? (
        <div className="text-center text-red-500">
          Failed to fetch products.
        </div>
      ) : (
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
                  <p className="mt-1">
                    Sizes: {prod.ProductSizes.map((s) => s.size).join(", ")}
                  </p>
                )}
              </div>
              <div className="flex justify-end mt-4 space-x-3">
                <button
                  className="text-yellow-500 hover:text-yellow-600"
                  onClick={() => navigate(`/edit-product/${prod.id}`)}
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(prod.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
