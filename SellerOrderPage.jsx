import { useEffect, useState } from "react";
import api from "../seller/services/api";
import Navbar from "../components/Navbar";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/orders/seller", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to fetch orders", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/orders/seller/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      enqueueSnackbar("Order status updated", { variant: "success" });
      fetchOrders(); // refresh table
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to update status", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center py-10">Loading orders...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
         <button
        onClick={() => navigate('/seller')}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        &larr; Back to Dashboard
      </button>
        <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="py-2 px-4 text-left">Order ID</th>
                  <th className="py-2 px-4 text-left">Customer</th>
                  <th className="py-2 px-4 text-left">Payment Status</th>
                  <th className="py-2 px-4 text-left">Order Status</th>
                  <th className="py-2 px-4 text-left">Total Items</th>
                  <th className="py-2 px-4 text-left">Total Amount</th>
                  <th className="py-2 px-4 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const totalItems = order.OrderItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );
                  const totalAmount = order.OrderItems.reduce(
                    (sum, item) => sum + item.quantity * item.Product.price,
                    0
                  );

                  return (
                    <tr
                      key={order.order_id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-2 px-4">{order.order_id}</td>
                      <td className="py-2 px-4">
                        {order.User?.name || "Unknown"}
                      </td>
                      <td
                        className={`py-2 px-4 font-semibold ${
                          order.payment_status === "success"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {order.payment_status}
                      </td>
                      <td className="py-2 px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.order_id, e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-2 px-4">{totalItems}</td>
                      <td className="py-2 px-4">${totalAmount.toFixed(2)}</td>
                      <td className="py-2 px-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default SellerOrdersPage;
