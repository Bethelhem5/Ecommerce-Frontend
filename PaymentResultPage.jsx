import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../Components/Navbar";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const tx_ref = searchParams.get("tx_ref");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;

    const checkStatus = async () => {
      try {
        const res = await api.get(`/payments/check-status?tx_ref=${tx_ref}`);
        setStatus(res.data.payment.status);
        setOrder(res.data.order || null);

        // Stop polling if payment is final
        if (
          res.data.payment.status === "success" ||
          res.data.payment.status === "failed"
        ) {
          clearInterval(interval);
          setLoading(false);
        }
      } catch (err) {
        setStatus("error");
        clearInterval(interval);
        setLoading(false);
      }
    };

    if (tx_ref) {
      checkStatus(); // Initial check
      interval = setInterval(checkStatus, 5000); // Poll every 5 seconds
    }

    return () => clearInterval(interval); // Cleanup on unmount
  }, [tx_ref]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-10 text-lg">
          Checking payment status...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-xl mx-auto text-center">
        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Payment Successful 🎉
            </h2>
            <p>Your order has been placed successfully.</p>
            {order && (
              <p className="mt-2 text-gray-600">
                Order ID:{" "}
                <span className="font-semibold">{order.order_id}</span>
              </p>
            )}
          </>
        )}

        {status === "pending" && (
          <h2 className="text-xl text-yellow-600 font-semibold mb-4">
            Payment is still pending...
          </h2>
        )}

        {status === "failed" && (
          <h2 className="text-xl text-red-600 font-semibold mb-4">
            Payment Failed ❌
          </h2>
        )}

        {status === "error" && (
          <h2 className="text-xl text-red-600 font-semibold mb-4">
            Something went wrong while checking payment status.
          </h2>
        )}

        <button
          onClick={() => navigate("/customer/orders")}
          className="mt-6 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          View My Orders
        </button>
      </div>
    </>
  );
};

export default PaymentResultPage;
