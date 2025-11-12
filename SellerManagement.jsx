import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

export default function SellerManagement() {
  const [sellers, setSellers] = useState([]);
  const [newSeller, setNewSeller] = useState({ name: "", email: "", password: "", role: "seller" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch sellers on component mount
  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:7777/api/auth/getSellers");
      const sellersData = res.data.filter(user => user.role === "seller");
      setSellers(sellersData);
    } catch (err) {
      setError("Failed to fetch sellers");
    }
    setLoading(false);
  };

  // Input change handler
  const handleInputChange = (e) => {
    setNewSeller({ ...newSeller, [e.target.name]: e.target.value });
  };

  // Add seller
  const handleAddSeller = async (e) => {
    e.preventDefault();
    if (!newSeller.name || !newSeller.email || !newSeller.password) return;

    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:7777/api/auth/register", newSeller);
      const addedSeller = res.data.user || res.data;
      setSellers(prev => [...prev, addedSeller]); // Dynamically update
      setNewSeller({ name: "", email: "", password: "", role: "seller" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add seller");
    }
    setLoading(false);
  };

  // Change seller status
  const handleStatusChange = async (userId, status) => {
    setLoading(true);
    setError("");
    try {
      const endpoint =
        status === "active"
          ? `http://localhost:7777/api/admin/reactivate/${userId}`
          : `http://localhost:7777/api/admin/block/${userId}`;
      await axios.put(endpoint);
      setSellers(prev =>
        prev.map(s => (s.user_id === userId || s._id === userId || s.id === userId ? { ...s, status } : s))
      ); // Update state dynamically
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
    setLoading(false);
  };

  // Delete seller
  const handleDeleteSeller = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this seller?")) return;

    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://localhost:7777/api/admin/seller/${userId}`);
      setSellers(prev => prev.filter(s => s.user_id !== userId && s._id !== userId && s.id !== userId)); // Remove dynamically
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete seller");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        &larr; Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-4">Seller Management</h2>

      {/* Add Seller Form */}
      <form onSubmit={handleAddSeller} className="mb-6 flex gap-3 items-end">
        <input
          type="text"
          name="name"
          value={newSeller.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="border rounded px-2 py-1 w-40"
          required
        />
        <input
          type="email"
          name="email"
          value={newSeller.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="border rounded px-2 py-1 w-52"
          required
        />
        <input
          type="password"
          name="password"
          value={newSeller.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="border rounded px-2 py-1 w-40"
          required
        />
        <button type="submit" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700" disabled={loading}>
          Add Seller
        </button>
      </form>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Sellers Table */}
      <div className="overflow-x-auto">
        {sellers.length === 0 && !loading ? (
          <div className="text-gray-500 text-center py-8">No sellers found.</div>
        ) : (
          <table className="min-w-full bg-gray-100 rounded shadow overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left border-b font-medium">Name</th>
                <th className="px-6 py-3 text-left border-b font-medium">Email</th>
                <th className="px-6 py-3 text-left border-b font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller, index) => (
                <tr key={seller.user_id || seller._id || seller.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{seller.name || "-"}</td>
                  <td className="px-6 py-4 border-b">{seller.email || "-"}</td>
                  <td className="px-6 py-4 border-b flex items-center gap-3">
                    <select
                      value={seller.status || "active"}
                      onChange={(e) =>
                        handleStatusChange(seller.user_id || seller._id || seller.id || index, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                      disabled={loading}
                    >
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                    </select>
                    <button
                      onClick={() => handleDeleteSeller(seller.user_id || seller._id || seller.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                      disabled={loading}
                    >
                      <MdDelete size={22} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {loading && <div className="mt-4 text-gray-600">Loading...</div>}
    </div>
  );
}
