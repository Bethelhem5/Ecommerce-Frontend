import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
	return (
		<nav className="w-full bg-white shadow-md py-4 px-8 flex items-center justify-between fixed top-0 left-0 z-50">
			<div className="text-2xl font-bold text-gray-800">E-Store</div>
			<div className="flex gap-8">
				<Link to="/" className="text-gray-800 hover:text-blue-600 font-medium">Home</Link>
                <Link to="/cart" className="text-gray-800 hover:text-blue-600 font-medium">Cart</Link>
                <Link to="/profile" className="text-gray-800 hover:text-blue-600 font-medium">Profile</Link>
                <Link to="/login" className="text-gray-800 hover:text-blue-600 font-medium">Sign in</Link>
			</div>
		</nav>
	);
};

export default Navbar;
