import { useEffect, useState } from "react";
import api from "../seller/services/api";

const SellerOverview = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalReviews: 0,
    status: "",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/auth/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 md:text-center sm:text-center lg:text-left ">
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium">Total Products</h2>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium">Orders</h2>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium">Reviews</h2>
          <p className="text-2xl font-bold">{stats.totalReviews}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium">Account Status</h2>
          <p
            className={`text-2xl font-bold ${
              stats.status === "active"
                ? "text-green-600"
                : stats.status === "blocked"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {stats.status || "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerOverview;
