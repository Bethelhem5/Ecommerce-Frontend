import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../seller/services/api";
import Navbar from "../components/Navbar";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const tx_ref = searchParams.get("tx_ref");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

 // PaymentResult.jsx
useEffect(() => {
  let interval;

  const checkStatus = async () => {
    try {
      const token = localStorage.getItem("token"); // or wherever you store JWT

      const res = await api.get(`/payments/check-status?tx_ref=${tx_ref}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus(res.data.status);
      setOrder(res.data.order || null);

      if (res.data.status === "success" || res.data.status === "failed") {
        clearInterval(interval);
        setLoading(false);
      }
    } catch (err) {
      console.error("Check status error:", err);
      setStatus("error");
      clearInterval(interval);
      setLoading(false);
    }
  };

  if (tx_ref) {
    checkStatus(); // Initial check
    interval = setInterval(checkStatus, 5000); // Poll every 5 seconds
  }

  return () => clearInterval(interval);
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

       
      </div>
    </>
  );
};

export default PaymentResult;
