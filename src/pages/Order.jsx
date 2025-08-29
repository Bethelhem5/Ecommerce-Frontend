import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const mockAddresses = [
  { id: 1, label: '123 Main St, New York, NY, USA' },
  { id: 2, label: '456 Elm St, Los Angeles, CA, USA' },
];

const Order = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [payment, setPayment] = useState('credit');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(items);
    // Default quantity 1 for each item
    setQuantities(Object.fromEntries(items.map(item => [item.id, 1])));
  }, []);

  const handleOrder = (e) => {
    e.preventDefault();
    // Here you would send order to backend
    setShowSuccess(true);
    // Optionally clear cart
    localStorage.removeItem('cart');
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate('/cart')}
        className="mb-4 text-gray-600 hover:underline text-lg font-medium"
      >
        &larr; Back to Cart
      </button>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Order</h1>
      <form onSubmit={handleOrder} className="bg-white p-8 rounded-lg shadow-md flex flex-col gap-6">
        {/* Order Items */}
        <div>
          <div className="text-lg font-semibold mb-2">Order Items</div>
          {cartItems.length === 0 ? (
            <div className="text-gray-500">No items in cart.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cartItems.map(item => (
                <li key={item.id} className="py-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.title} className="h-16 w-16 object-contain" />
                    <div>
                      <div className="font-medium text-gray-800">{item.title}</div>
                      <div className="text-gray-500 text-sm">${item.price}</div>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={quantities[item.id] || 1}
                    onChange={e => setQuantities(q => ({ ...q, [item.id]: Number(e.target.value) }))}
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <div className="text-lg font-semibold mb-2">Payment Method</div>
          <select value={payment} onChange={e => setPayment(e.target.value)} className="border border-gray-300 rounded px-4 py-2 w-full">
            <option value="credit">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>

        {/* Shipping Address */}
        <div>
          <div className="text-lg font-semibold mb-2">Shipping Address</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Street</label>
              <select value={street} onChange={e => setStreet(e.target.value)} className="border border-gray-300 rounded px-4 py-2 w-full" required>
                <option value="">Select street</option>
                <option value="123 Main St">123 Main St</option>
                <option value="456 Elm St">456 Elm St</option>
                <option value="789 Oak Ave">789 Oak Ave</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">City</label>
              <select value={city} onChange={e => setCity(e.target.value)} className="border border-gray-300 rounded px-4 py-2 w-full" required>
                <option value="">Select city</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="Houston">Houston</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">State</label>
              <select value={state} onChange={e => setState(e.target.value)} className="border border-gray-300 rounded px-4 py-2 w-full" required>
                <option value="">Select state</option>
                <option value="NY">NY</option>
                <option value="CA">CA</option>
                <option value="IL">IL</option>
                <option value="TX">TX</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Postal Code</label>
              <select value={postalCode} onChange={e => setPostalCode(e.target.value)} className="border border-gray-300 rounded px-4 py-2 w-full" required>
                <option value="">Select postal code</option>
                <option value="10001">10001</option>
                <option value="90001">90001</option>
                <option value="60601">60601</option>
                <option value="77001">77001</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Country</label>
              <select value={country} onChange={e => setCountry(e.target.value)} className="border border-gray-300 rounded px-4 py-2 w-full" required>
                <option value="">Select country</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="bg-gray-600 text-white py-3 rounded hover:bg-gray-700 font-semibold text-lg">Place Order</button>
      </form>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
            <div className="text-2xl font-bold text-green-600 mb-4">Successful Payment!</div>
            <button onClick={() => setShowSuccess(false)} className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
