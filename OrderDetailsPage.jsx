import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../../services/api";
import Navbar from "../../Components/Navbar";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Fetch order details
  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/customer/${orderId}`);
      const orderData = res.data.order;

      // Map Product.id -> product_id for frontend consistency
      orderData.OrderItems.forEach((item) => {
        if (item.Product) item.Product.product_id = item.Product.id;
      });

      setOrder(orderData);
    } catch {
      enqueueSnackbar("Failed to load order details", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Poll payment status if order is pending
  const pollPaymentStatus = async () => {
    if (!order || order.payment_status !== "pending") return;

    try {
      const tx_ref = order.Payment?.tx_ref;
      if (!tx_ref) return;

      const res = await api.get(`/payments/check-status?tx_ref=${tx_ref}`);
      const paymentStatus = res.data.payment?.status;

      if (paymentStatus && paymentStatus !== "pending") {
        enqueueSnackbar(`Payment ${paymentStatus}`, {
          variant: paymentStatus === "success" ? "success" : "error",
        });
        fetchOrder(); // Refresh order
      }
    } catch {
      console.error("Payment polling failed for order", orderId);
    }
  };

  useEffect(() => {
    fetchOrder();

    const interval = setInterval(() => {
      fetchOrder();
      pollPaymentStatus();
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [orderId, order?.payment_status]);

  if (loading)
    return (
      <p className="flex justify-center mt-10 text-gray-500">
        Loading order details...
      </p>
    );

  if (!order)
    return (
      <p className="flex justify-center mt-10 text-gray-500">
        Order not found.
      </p>
    );

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Order #{order.order_id}</h2>

        <div className="mb-2">
          <span className="font-semibold">Status: </span>
          <span
            className={`font-semibold ${
              order.status === "Delivered"
                ? "text-green-600"
                : order.status === "Pending"
                ? "text-yellow-600"
                : "text-gray-600"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="mb-2">
          <span className="font-semibold">Payment: </span>
          <span
            className={`font-semibold ${
              order.payment_status === "success"
                ? "text-green-600"
                : order.payment_status === "pending"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {order.payment_status}
          </span>
        </div>

        <p className="mb-4 font-medium">Total Amount: ${order.total_amount}</p>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Items:</h3>
          <ul className="ml-4 list-disc text-gray-700">
            {order.OrderItems.map((item) => (
              <li key={item.order_item_id}>
                {item.Product?.name || "Product removed"} - $
                {item.price_at_purchase} x {item.quantity}
              </li>
            ))}
          </ul>
        </div>

        {order.shipping_address && (
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-2">Shipping Address:</h3>
            <p>{order.shipping_address.full_name}</p>
            <p>
              {order.shipping_address.street}, {order.shipping_address.city},{" "}
              {order.shipping_address.state}{" "}
              {order.shipping_address.postal_code}
            </p>
            <p>{order.shipping_address.country}</p>
            <p>{order.shipping_address.phone}</p>
          </div>
        )}

        {order.order_id && (
          <div className="mt-6">
            <button
              onClick={() => navigate("/orders")}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Back to Orders
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderDetailsPage;
