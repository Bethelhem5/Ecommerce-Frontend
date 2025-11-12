import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdBlock, MdCheckCircle, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";   
export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch all customers
  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:7777/api/admin/customers"); // or your admin endpoint
      let data = Array.isArray(res.data)
        ? res.data
        : res.data.customers || res.data.users || [];
      const filteredCustomers = data.filter((user) => user.role === "customer");
      setCustomers(filteredCustomers.length > 0 ? filteredCustomers : data);
    } catch (err) {
      console.error("Fetch customers error:", err.response?.data || err.message);
      setError("Failed to fetch customers");
    }
    setLoading(false);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  // Add a new customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!newCustomer.name || !newCustomer.email || !newCustomer.password) {
      setError("Name, email, and password are required");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:7777/api/admin/customer", // replace with your correct endpoint
        newCustomer
      );
      const addedCustomer = res.data.user || res.data;
      setCustomers([...customers, addedCustomer]);
      setNewCustomer({ name: "", email: "", password: "", role: "customer" });
      setSuccess("Customer added successfully!");
      setError("");
    } catch (err) {
      console.error("Add customer error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to add customer");
    }
    setLoading(false);
  };

  // Change customer status
  const handleStatusChange = async (userId, status) => {
    setLoading(true);
    setError("");
    try {
      let endpoint = "";
      if (status === "active") {
        endpoint = `http://localhost:7777/api/admin/reactivate/${userId}`;
      } else if (status === "blocked") {
        endpoint = `http://localhost:7777/api/admin/block/${userId}`;
      } else {
        setError("Invalid status");
        setLoading(false);
        return;
      }

      await axios.put(endpoint);

      setCustomers((prev) =>
        prev.map((c) =>
          c._id === userId || c.user_id === userId ? { ...c, status } : c
        )
      );
    } catch (err) {
      console.error("Status change error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update status");
    }
    setLoading(false);
  };

  // Delete customer
  const handleDeleteCustomer = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://localhost:7777/api/admin/customer/${userId}`);
      setCustomers((prev) => prev.filter((c) => c._id !== userId && c.user_id !== userId));
      setSuccess("Customer deleted successfully!");
    } catch (err) {
      console.error("Delete customer error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to delete customer");
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
      <h2 className="text-2xl font-bold mb-4">Customer Management</h2>

      {/* Add Customer Form */}
      <form onSubmit={handleAddCustomer} className="mb-6 flex gap-3 items-end">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={newCustomer.name}
            onChange={handleInputChange}
            className="border rounded px-2 py-1 w-40"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={newCustomer.email}
            onChange={handleInputChange}
            className="border rounded px-2 py-1 w-52"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={newCustomer.password}
            onChange={handleInputChange}
            className="border rounded px-2 py-1 w-40"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          disabled={loading}
        >
          Add
        </button>
      </form>

      {/* Messages */}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      {/* Customers Table */}
      {customers.length === 0 && !loading ? (
        <div className="text-gray-500 text-center py-8">No customers found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-100 rounded shadow overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left border-b font-medium">Name</th>
                <th className="px-6 py-3 text-left border-b font-medium">Email</th>
                <th className="px-6 py-3 text-left border-b font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, index) => {
                const customerId = c._id || c.user_id || index;
                return (
                  <tr key={customerId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">{c.name || "-"}</td>
                    <td className="px-6 py-4 border-b">{c.email || "-"}</td>
                    <td className="px-6 py-4 border-b flex items-center gap-3">
                      <select
                        value={c.status || "active"}
                        onChange={(e) => handleStatusChange(customerId, e.target.value)}
                        className="border rounded px-2 py-1"
                        disabled={loading}
                      >
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                      </select>
                      <button
                        onClick={() => handleDeleteCustomer(customerId)}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                        disabled={loading}
                      >
                        <MdDelete size={22} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {loading && <div className="mt-4 text-gray-600">Loading...</div>}
    </div>
  );
}
