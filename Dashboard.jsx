import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:7777/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const modules = [
    { name: "Seller Management", path: "/sellers" },
    { name: "Category Management", path: "/categories" },
    { name: "Reports", path: "/reports" },
    { name: "User Management", path: "/users" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const prodRes = await axios.get(`${API_BASE}/products`);
        setProducts(prodRes.data.products || prodRes.data || []);

        const sellerRes = await axios.get(`${API_BASE}/auth/getSellers`);
        const sellerData = Array.isArray(sellerRes.data)
          ? sellerRes.data
          : sellerRes.data?.sellers || [];
        setSellers(sellerData);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Map seller IDs to their actual names
  const sellerMap = useMemo(() => {
  const map = {};
  if (!Array.isArray(sellers)) return map;

  sellers.forEach((s) => {
    // Use user_id as key
    const id = String(s.user_id); // ensure it's string
    const name = s.name || "Unknown"; // use the name field
    map[id] = name;
  });

  return map;
}, [sellers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col py-8 px-4">
        <h2 className="text-2xl font-bold mb-8">Admin Menu</h2>
        <ul className="space-y-4">
          {modules.map((module, i) => (
            <li
              key={i}
              className="cursor-pointer hover:bg-gray-700 rounded px-3 py-2"
              onClick={() => navigate(module.path)}
            >
              {module.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">All Products</h1>

        {products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.product_id || p.id || p._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col"
              >
                <div className="h-48 w-full overflow-hidden rounded mb-2">
                  <img
                    src={
                      p?.image?.startsWith?.("http")
                        ? p.image
                        : p?.image
                        ? `http://localhost:7777/uploads/${p.image}`
                        : "/placeholder.png"
                    }
                    alt={p.name}
                    className="h-40 object-contain mb-4 cursor-pointer"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                </div>
                <h2 className="font-semibold text-lg mb-1">{p.name}</h2>
                <p className="text-gray-600 mb-1">{p.description}</p>
                <p className="font-medium mb-1">Price: ${p.price}</p>
                <p className="mb-1">Stock: {p.stock}</p>
               <p className="text-purple-600 font-medium">
                  Seller: {sellerMap[String(p.seller_id)] || "Unknown"}
               </p>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
