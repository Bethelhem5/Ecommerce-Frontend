import { useLocation, Link } from "react-router-dom";

const ConfirmPage = () => {
  const location = useLocation();
  const { order } = location.state || {};

  if (!order) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">No order found</h2>
        <Link to="/" className="text-blue-600 underline">
          Go back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        🎉 Order Confirmed!
      </h2>
      <p>Order ID: {order.order_id}</p>
      <p>Status: {order.status}</p>
      <p>Total: ${order.total_amount}</p>
      <Link
        to="/customer/orders"
        className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        View Orders
      </Link>
      <Link to="/" className="mt-2 inline-block text-blue-600 underline">
        Continue Shopping
      </Link>
    </div>
  );
};

export default ConfirmPage;
