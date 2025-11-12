import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
const API_BASE = "http://localhost:7777/api";

const SellerReviewPage = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerReviews = async () => {
      try {
        setLoading(true);
        // Call backend function directly for this seller
        const reviewRes = await axios.get(
          `${API_BASE}/reviews/seller/${userId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        setReviews(reviewRes.data.reviews || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching seller reviews:", err);
        setError("Failed to fetch reviews");
        setLoading(false);
      }
    };

    if (user && user.role === "seller") {
      fetchSellerReviews();
    }
  }, [user]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
       <button
        onClick={() => navigate('/seller')}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        &larr; Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold mb-6 text-center">My Product Reviews</h1>
      {reviews.length === 0 ? (
        <div className="text-gray-500 text-center">
          No reviews for your products yet.
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">
                  {review.Product?.name}
                </span>
                <span className="text-yellow-500 font-bold">
                  Rating: {review.rating} ★
                </span>
              </div>
              <p className="text-gray-700 mb-2">{review.comment}</p>
              <div className="text-sm text-gray-500">
                By: {review.User?.name || "Anonymous"} ({review.User?.email || "No email"})
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(review.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerReviewPage;
