// src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { useSnackbar } from "notistack";
import Navbar from "../../Components/Navbar";
import StarRating from "./StarRating";
import { decodeToken } from "../../../utils/decodeToken";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({ rating: "", reviewText: "" });
  const [editReviewData, setEditReviewData] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("token");
  const decoded = decodeToken(token);
  const userId = decoded?.user_id;

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product);
    } catch (err) {
      enqueueSnackbar("Failed to fetch product details", { variant: "error" });
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/product/${id}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      enqueueSnackbar("Failed to fetch reviews", { variant: "error" });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchProduct();
      await fetchReviews();
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleChange = (e) => {
    setReviewData({ ...reviewData, [e.target.name]: e.target.value });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      if (editReviewData) {
        await api.put(`/reviews/edit/${editReviewData.review_id}`, {
          rating: reviewData.rating,
          reviewText: reviewData.reviewText,
        });
        setEditReviewData(null);
        enqueueSnackbar("Review updated", { variant: "success" });
      } else {
        await api.post("/reviews/add", {
          productId: id,
          rating: reviewData.rating,
          reviewText: reviewData.reviewText,
        });
        enqueueSnackbar("Review added", { variant: "success" });
      }
      setReviewData({ rating: "", reviewText: "" });
      fetchProduct();
      fetchReviews();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || "Failed to submit review",
        {
          variant: "error",
        }
      );
    }
  };

  const handleEdit = (review) => {
    setEditReviewData(review);
    setReviewData({ rating: review.rating, reviewText: review.review_text });
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/delete/${reviewId}`);
      enqueueSnackbar("Review deleted", { variant: "success" });
      fetchProduct();
      fetchReviews();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || "Failed to delete review",
        {
          variant: "error",
        }
      );
    }
  };

  if (loading)
    return <p className="p-4 text-center text-gray-600">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Product info */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row gap-6">
          <img
            src={`http://localhost:7777/uploads/${product.image}`}
            alt={product.name}
            className="w-full md:w-1/3 h-64 md:h-80 object-cover rounded-lg"
          />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.review_count > 0 && (
                <StarRating
                  rating={product.avg_rating || 0}
                  reviewCount={product.review_count || 0}
                />
              )}
              <p className="text-gray-600 mt-3">{product.description}</p>
              <p className="mt-4 font-bold text-lg">Price: ${product.price}</p>
              <p className="mt-1 text-gray-700">Stock: {product.stock}</p>

              {product.ProductSizes && product.ProductSizes.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-1">Available Sizes:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ProductSizes.map((s) => (
                      <span
                        key={s.size_id}
                        className="px-3 py-1 border border-gray-300 rounded-full text-sm bg-gray-50"
                      >
                        {s.size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Review */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            {editReviewData ? "Edit Your Review" : "Add a Review"}
          </h2>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Rating (1-5)
              </label>
              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                value={reviewData.rating}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Your Review
              </label>
              <textarea
                name="reviewText"
                value={reviewData.reviewText}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition"
            >
              {editReviewData ? "Update Review" : "Submit Review"}
            </button>
          </form>
        </div>

        {/* Reviews */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.review_id} className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">
                      {r.User?.name} ({r.User?.email})
                    </p>
                    {r.customer_id === userId && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(r)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(r.review_id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <StarRating rating={r.rating} reviewCount={0} />
                  <p className="text-gray-700 mt-1">{r.review_text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
