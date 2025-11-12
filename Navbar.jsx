import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole"); // 'admin', 'seller', or 'customer'
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/"; // redirect to home
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  // Hide navbar completely for admin/seller pages
  const hideNavbarForAdminSeller =
    location.pathname.startsWith("/admin") || location.pathname.startsWith("/seller");

  if (hideNavbarForAdminSeller) {
    return (
      <nav className="w-full bg-white shadow-md py-4 px-4 sm:px-8 flex items-center justify-between fixed top-0 left-0 z-50">
        <Link
          to={role === "admin" ? "/admin/dashboard" : "/seller"}
          className="text-2xl font-extrabold font-serif tracking-wide text-gray-600 hover:text-blue-600"
        >
          {role === "admin" ? "Admin Panel" : ""}
        </Link>
        <button
          onClick={handleLogout}
          className="text-gray-800 hover:text-red-600 font-medium"
        >
          Logout
        </button>
      </nav>
    );
  }

  // Customer navbar
  return (
    <nav className="w-full bg-white shadow-md py-4 px-4 sm:px-8 flex items-center justify-between fixed top-0 left-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-2xl font-extrabold font-serif tracking-wide text-gray-600">
        EthioMart
      </Link>

      {/* Hamburger Menu for small screens */}
      <div className="sm:hidden">
        <button onClick={toggleMenu} className="text-gray-800 focus:outline-none">
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Links */}
      <div
        className={`flex-col sm:flex sm:flex-row sm:items-center gap-4 sm:gap-8 absolute sm:static top-16 left-0 w-full sm:w-auto bg-white sm:bg-transparent shadow-md sm:shadow-none transition-all duration-300 ${
          isOpen ? "flex" : "hidden"
        }`}
      >
        <Link to="/" className="text-gray-800 hover:text-blue-600 font-medium px-4 py-2 sm:p-0">
          Home
        </Link>
        <Link to="/cart" className="text-gray-800 hover:text-blue-600 font-medium px-4 py-2 sm:p-0">
          Cart
        </Link>

        {token ? (
          <>
            <Link to="/profile" className="text-gray-800 hover:text-blue-600 font-medium px-4 py-2 sm:p-0">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-800 hover:text-red-600 font-medium px-4 py-2 sm:p-0"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="text-gray-800 hover:text-blue-600 font-medium px-4 py-2 sm:p-0">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
