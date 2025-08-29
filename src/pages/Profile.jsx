import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const Profile = () => {
  // Fetch from backend
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Replace with your real backend endpoint
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setAddress(data.address);
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Popup state
  const [showEditUser, setShowEditUser] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);

  // Edit form state
  const [editUser, setEditUser] = useState(user);
  const [editAddress, setEditAddress] = useState(address);

  const handleUserEdit = (e) => {
    e.preventDefault();
    setUser(editUser);
    setShowEditUser(false);
  };
  const handleAddressEdit = (e) => {
    e.preventDefault();
    setAddress(editAddress);
    setShowEditAddress(false);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!user || !address) return <div className="flex justify-center items-center min-h-screen text-red-500">Failed to load profile.</div>;
  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Profile</h1>

      {/* Personal Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 flex justify-between items-center">
        <div>
          <div className="text-lg font-semibold text-gray-700">Personal Information</div>
          <div className="mt-2 text-gray-600">Name: {user.name}</div>
          <div className="text-gray-600">Email: {user.email}</div>
          <div className="text-gray-600">Phone: {user.phone}</div>
        </div>
        <button onClick={() => { setEditUser(user); setShowEditUser(true); }} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Edit</button>
      </div>

      {/* Edit Personal Info Popup */}
      {showEditUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-4" onSubmit={handleUserEdit}>
            <h2 className="text-xl font-bold mb-2">Edit Personal Info</h2>
            <input type="text" value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })} placeholder="Name" className="border border-gray-300 rounded px-4 py-2" />
            <input type="email" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} placeholder="Email" className="border border-gray-300 rounded px-4 py-2" />
            <input type="text" value={editUser.phone} onChange={e => setEditUser({ ...editUser, phone: e.target.value })} placeholder="Phone" className="border border-gray-300 rounded px-4 py-2" />
            <div className="flex gap-4 mt-2">
              <button type="submit" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
              <button type="button" onClick={() => setShowEditUser(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Shipping Address */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 flex justify-between items-center">
        <div>
          <div className="text-lg font-semibold text-gray-700">Shipping Address</div>
          <div className="mt-2 text-gray-600">{address.street}, {address.city}, {address.state} {address.zip}, {address.country}</div>
        </div>
        <button onClick={() => { setEditAddress(address); setShowEditAddress(true); }} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Edit</button>
      </div>

      {/* Edit Address Popup */}
      {showEditAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-4" onSubmit={handleAddressEdit}>
            <h2 className="text-xl font-bold mb-2">Edit Shipping Address</h2>
            <input type="text" value={editAddress.street} onChange={e => setEditAddress({ ...editAddress, street: e.target.value })} placeholder="Street" className="border border-gray-300 rounded px-4 py-2" />
            <input type="text" value={editAddress.city} onChange={e => setEditAddress({ ...editAddress, city: e.target.value })} placeholder="City" className="border border-gray-300 rounded px-4 py-2" />
            <input type="text" value={editAddress.state} onChange={e => setEditAddress({ ...editAddress, state: e.target.value })} placeholder="State" className="border border-gray-300 rounded px-4 py-2" />
            <input type="text" value={editAddress.zip} onChange={e => setEditAddress({ ...editAddress, zip: e.target.value })} placeholder="ZIP" className="border border-gray-300 rounded px-4 py-2" />
            <input type="text" value={editAddress.country} onChange={e => setEditAddress({ ...editAddress, country: e.target.value })} placeholder="Country" className="border border-gray-300 rounded px-4 py-2" />
            <div className="flex gap-4 mt-2">
              <button type="submit" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Save</button>
              <button type="button" onClick={() => setShowEditAddress(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-lg font-semibold text-gray-700 mb-4">Ordered Products</div>
        <ul className="divide-y divide-gray-200">
          {orders.map(order => (
            <li key={order.id} className="py-4 flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-800">{order.name}</div>
                <div className="text-gray-500 text-sm">Ordered on {order.date}</div>
              </div>
              <div className="text-blue-600 font-bold text-lg">${order.price}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
