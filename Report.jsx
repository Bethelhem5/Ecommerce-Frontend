import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE = "http://localhost:7777/api";

const Report = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [productSummary, setProductSummary] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch all payments initially
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/payments/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(res.data.payments ?? []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load payments");
        setLoading(false);
      }
    };

    fetchPayments();
  }, [token]);

  // Generate sales report
  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return alert("Please select both dates");

    try {
      const res = await axios.get(`${API_BASE}/payments/report`, {
        params: { startDate, endDate }, // ✅ send query params
        headers: { Authorization: `Bearer ${token}` },
      });

      const { payments: reportPayments, totalRevenue } = res.data;

      setPayments(reportPayments ?? []);
      setTotalRevenue(Number(totalRevenue ?? 0));

      if (!reportPayments || reportPayments.length === 0) {
        setSnackbar("No transactions available for the selected date range");
        setTimeout(() => setSnackbar(""), 3000);
      }

      // Generate product summary
      const summary = {};
      (reportPayments ?? []).forEach((p) => {
        (p.Order?.OrderItems ?? []).forEach((item) => {
          const name = item.Product?.name || "Unknown Product";
          if (!summary[name]) summary[name] = { quantity: 0, revenue: 0 };
          summary[name].quantity += item.quantity ?? 0;
          summary[name].revenue +=
            (item.quantity ?? 0) * Number(item.Product?.price ?? 0);
        });
      });

      setProductSummary(
        Object.entries(summary).map(([name, data]) => ({
          name,
          quantity: data.quantity,
          revenue: data.revenue,
        }))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to generate report");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-500">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-red-500">
        {error}
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen relative">
       <button
        onClick={() => navigate('/admin/dashboard')}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        &larr; Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold mb-6">Sales Report</h1>

      {/* Date Filter Form */}
      <form
        onSubmit={handleGenerateReport}
        className="flex gap-4 items-end mb-6"
      >
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate Report
        </button>
      </form>

      {/* Snackbar */}
      {snackbar && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
          {snackbar}
        </div>
      )}

      {/* Total Revenue */}
      <div className="mb-4 text-xl font-semibold text-green-600">
        Total Revenue: ETB{Number(totalRevenue).toFixed(2)}
      </div>

      {/* Product Summary */}
      {productSummary.length > 0 && (
        <div className="mb-6 bg-white rounded shadow p-4">
          <h2 className="text-xl font-bold mb-2">Products Summary</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">
                  Product
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold">
                  Quantity Sold
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productSummary.map((p) => (
                <tr key={p.name}>
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.quantity}</td>
                  <td className="px-4 py-2">
                    ${Number(p.revenue).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payments Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Customer Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Email
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Amount
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Status
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Transaction Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((p) => (
              <tr key={p.id || p.payment_id}>
                <td className="px-4 py-2">{p.Order?.User?.name || "N/A"}</td>
                <td className="px-4 py-2">{p.Order?.User?.email || "N/A"}</td>
                <td className="px-4 py-2">
                  ${Number(p.amount ?? 0).toFixed(2)}
                </td>
                <td className="px-4 py-2">{p.status}</td>
                <td className="px-4 py-2">
                  {p.transaction_date
                    ? new Date(p.transaction_date).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
