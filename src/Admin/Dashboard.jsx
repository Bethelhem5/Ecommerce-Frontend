import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
	const navigate = useNavigate();
	const sections = [
		{ label: 'Product Management', path: '/productmanagement' },
		{ label: 'Product Review', path: '/productreview' },
		{ label: 'Orders', path: '/orders' },
		{ label: 'Category Management', path: '/categorymanagement' },
		{ label: 'Add Seller', path: '/addseller' },
	];

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
			<h1 className="text-4xl font-bold mb-10 text-gray-800">Admin Dashboard</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
				{sections.map(section => (
					<button
						key={section.label}
						onClick={() => navigate(section.path)}
						className="bg-white shadow-md rounded-lg p-8 text-2xl font-semibold text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition w-full text-left"
					>
						{section.label}
					</button>
				))}
			</div>
		</div>
	);
};

export default Dashboard;
