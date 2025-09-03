import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import ProfileInfo from "./ProfileInfo";
import api from "../../services/api";

const Navbar = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
    // Fetch cart count from backend
    const fetchCartCount = async () => {
      try {
        const res = await api.get("/cart/");
        const items = Array.isArray(res.data.cart?.CartItems)
          ? res.data.cart.CartItems
          : [];
        setCartCount(items.length);
      } catch (err) {
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("role");
    setUserInfo(null);
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-purple-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/customer/dashboard"
            className="text-xl font-bold tracking-wide hover:text-purple-200"
          >
            E-Commerce
          </Link>
          {/* Desktop: Cart Icon and Profile */}
          <div className="hidden md:flex items-center gap-6">
            <div className="relative">
              <FaShoppingCart
                className="w-7 h-7 text-white hover:text-purple-200 cursor-pointer"
                onClick={() => navigate("/customer/cart")}
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">
                  {cartCount}
                </span>
              )}
            </div>
            <ProfileInfo userInfo={userInfo} onLogout={handleLogout} />
          </div>
          {/* Mobile: Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none"
              aria-label="Open menu"
            >
              {menuOpen ? (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-purple-600 px-4 pb-4 pt-2 space-y-4 rounded-b-xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="relative">
              <FaShoppingCart
                className="w-7 h-7 text-white hover:text-purple-200 cursor-pointer"
                onClick={() => navigate("/customer/cart")}
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">
                  {cartCount}
                </span>
              )}
            </div>
            <ProfileInfo userInfo={userInfo} onLogout={handleLogout} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
