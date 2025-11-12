import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../src/seller/services/api";
import Navbar from "../src/components/Navbar";

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  // Get tx_ref from URL if present
  const query = new URLSearchParams(location.search);
  const tx_ref = query.get("tx_ref");

  // Fetch all customer orders
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/customer");
      const ordersData = res.data.orders || [];
      // Map product.id -> product_id for frontend consistency
      ordersData.forEach((order) => {
        order.OrderItems.forEach((item) => {
          if (item.Product) item.Product.product_id = item.Product.id;
        });
      });
      setOrders(ordersData);
    } catch {
      enqueueSnackbar("Failed to load orders", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Poll payment status if tx_ref exists
  const pollPayment = async () => {
    if (!tx_ref) return;

    try {
      const res = await api.get(`/payments/check-status?tx_ref=${tx_ref}`);
      const { payment, order } = res.data;

      if (payment.status && payment.status !== "pending") {
        enqueueSnackbar(`Payment ${payment.status}`, {
          variant: payment.status === "success" ? "success" : "error",
        });

        // Refresh orders
        fetchOrders();

        // Remove tx_ref from URL
        navigate("/customer/orders", { replace: true });
      }
    } catch {
      console.error("Payment polling failed");
    }
  };

  useEffect(() => {
    fetchOrders();

    // Poll orders every 10s
    const ordersInterval = setInterval(fetchOrders, 10000);

    // Poll payment every 5s if tx_ref exists
    let paymentInterval;
    if (tx_ref) paymentInterval = setInterval(pollPayment, 5000);

    return () => {
      clearInterval(ordersInterval);
      if (paymentInterval) clearInterval(paymentInterval);
    };
  }, [tx_ref]);

  const handleOrderClick = (orderId) => navigate(`/orders/${orderId}`);

  if (loading)
    return (
      <p className="flex justify-center mt-10 text-gray-500">
        Loading orders...
      </p>
    );

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Your Orders</h2>
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">You have no orders yet.</p>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="p-5 border rounded-lg shadow-md hover:shadow-lg transition cursor-pointer hover:bg-gray-50"
                onClick={() => handleOrderClick(order.order_id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold">
                    Order #{order.order_id}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  Payment:{" "}
                  <span
                    className={`font-medium ${
                      order.payment_status === "success"
                        ? "text-green-600"
                        : order.payment_status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  Total Amount: ${order.total_amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerOrdersPage;
