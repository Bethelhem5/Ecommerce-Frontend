import React, { useEffect, useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';

const Cart = () => {
	const [cartItems, setCartItems] = useState([]);
	const navigate = useNavigate();
	// Sizes for demo
	const sizes = ['S', 'M', 'L', 'XL'];

	// Load cart items from localStorage
	useEffect(() => {
		const items = JSON.parse(localStorage.getItem('cart')) || [];
		// Add default size and quantity if not present
		const withOptions = items.map(item => ({
			...item,
			size: item.size || 'M',
			quantity: item.quantity || 1
		}));
		setCartItems(withOptions);
		localStorage.setItem('cart', JSON.stringify(withOptions));
	}, []);

	// Remove item from cart
	const handleCancel = (id) => {
		const updated = cartItems.filter(item => item.id !== id);
		setCartItems(updated);
		localStorage.setItem('cart', JSON.stringify(updated));
	};

	// Update size or quantity
	const handleOptionChange = (id, field, value) => {
		const updated = cartItems.map(item =>
			item.id === id ? { ...item, [field]: value } : item
		);
		setCartItems(updated);
		localStorage.setItem('cart', JSON.stringify(updated));
	};

	// Go to order page
	const handleOrder = () => {
		navigate('/order');
	};

	return (
		<div className="max-w-3xl mx-auto p-8 bg-gray-100 min-h-screen">
			<h1 className="text-3xl font-bold mb-8 text-gray-800">Cart</h1>
			{cartItems.length === 0 ? (
				<div className="text-gray-500 text-xl">Your cart is empty.</div>
			) : (
				<>
					<ul className="divide-y divide-gray-200 mb-8">
						{cartItems.map(item => (
							<li key={item.id} className="py-4 flex flex-col md:flex-row justify-between items-center bg-white rounded-lg shadow mb-4 px-6">
								<div className="flex items-center gap-4 w-full md:w-auto">
									<img src={item.image} alt={item.title} className="h-20 w-20 object-contain" />
									<div>
										<div className="font-medium text-gray-800">{item.title}</div>
										<div className="text-gray-500 text-sm">${item.price}</div>
										<div className="flex gap-4 mt-2">
											<div>
												<label className="text-gray-700 text-sm mr-1">Size:</label>
												<select
													value={item.size}
													onChange={e => handleOptionChange(item.id, 'size', e.target.value)}
													className="border rounded px-2 py-1"
												>
													{sizes.map(size => (
														<option key={size} value={size}>{size}</option>
													))}
												</select>
											</div>
											<div>
												<label className="text-gray-700 text-sm mr-1">Qty:</label>
												<input
													type="number"
													min={1}
													value={item.quantity}
													onChange={e => handleOptionChange(item.id, 'quantity', Math.max(1, Number(e.target.value)))}
													className="border rounded px-2 py-1 w-16"
												/>
											</div>
										</div>
									</div>
								</div>
								<button onClick={() => handleCancel(item.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mt-4 md:mt-0">Cancel</button>
							</li>
						))}
					</ul>
					<Link to='/order' className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700 font-semibold w-full">checkout</Link>
				</>
			)}
		</div>
	);
};

export default Cart;
