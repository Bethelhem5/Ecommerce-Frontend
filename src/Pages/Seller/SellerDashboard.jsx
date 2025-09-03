import { Outlet, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../services/api";
import { useSnackbar } from "notistack";

const SellerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Closed by default
  const [products, setProducts] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  // Toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sellerId = parseInt(
        localStorage.getItem("userInfo")
          ? JSON.parse(localStorage.getItem("userInfo")).user_id
          : 0
      );
      const myProducts = response.data.products.filter(
        (p) => p.seller_id === sellerId
      );
      setProducts(myProducts);
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to fetch products", { variant: "error" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("role");
    setUserInfo(null);
    navigate("/");
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      enqueueSnackbar("Product deleted successfully", { variant: "success" });
      setProducts(products.filter((p) => p.product_id !== productId));
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to delete product", { variant: "error" });
    }
  };

  // Handle screen size changes to reset sidebar state
  useEffect(() => {
    fetchProducts();

    // Reset sidebar state based on screen size
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false); // Close sidebar on desktop
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check initial screen size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`
          fixed z-40 inset-y-0 left-0 w-64 transform bg-purple-700 text-white p-5 space-y-4
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:w-64
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={toggleSidebar}
          className="md:hidden mb-6 text-white text-xl"
        >
          
        </button>

        <nav className="flex flex-col gap-3">
          <NavLink
            to="/seller/overview"
            className={({ isActive }) =>
              `block px-3 py-2 rounded hover:bg-purple-600 ${
                isActive ? "bg-purple-800" : ""
              }`
            }
            onClick={() => setSidebarOpen(false)} // Close sidebar on link click (mobile)
          >
            Overview
          </NavLink>
          <NavLink
            to="/seller/my-products"
            className={({ isActive }) =>
              `block px-3 py-2 rounded hover:bg-purple-600 ${
                isActive ? "bg-purple-800" : ""
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            My Products
          </NavLink>
          <NavLink
            to="/seller/AddProducts"
            className={({ isActive }) =>
              `block px-3 py-2 rounded hover:bg-purple-600 ${
                isActive ? "bg-purple-800" : ""
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            Add Product
          </NavLink>
          <NavLink
            to="/seller/orders"
            className={({ isActive }) =>
              `block px-3 py-2 rounded hover:bg-purple-600 ${
                isActive ? "bg-purple-800" : ""
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            Orders
          </NavLink>
          <NavLink
            to="/seller/reviews"
            className={({ isActive }) =>
              `block px-3 py-2 rounded hover:bg-purple-600 ${
                isActive ? "bg-purple-800" : ""
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            Reviews
          </NavLink>
          <NavLink
            to="/seller/profile"
            className={({ isActive }) =>
              `block px-3 py-2 rounded hover:bg-purple-600 ${
                isActive ? "bg-purple-800" : ""
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            Profile
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-3 py-2 rounded hover:bg-purple-600 ${
                isActive ? "bg-purple-800" : ""
              }`
            }
            onClick={() => {
                handleLogout()
                setSidebarOpen(false)}}
          >
            Logout
          </NavLink>
        </nav>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Hamburger Button for mobile */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 md:hidden text-white p-2 ml-4 rounded ${
          sidebarOpen ? "" : "bg-purple-700"
        }`}
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* Main Content */}
      <div className="flex-1 p-5 md:ml-10">
        <Outlet context={{ products, handleDelete, fetchProducts }} />
      </div>
    </div>
  );
};

export default SellerDashboard;
