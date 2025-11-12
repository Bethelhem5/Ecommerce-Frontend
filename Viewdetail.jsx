import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useAuth } from "../AuthContext";

const API_BASE = "http://localhost:7777/api";

const Viewdetail = () => {
  const { user } = useAuth();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: "", comment: "" });
  const [editReview, setEditReview] = useState(null);
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("token");

  // Fetch product
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products/${productId}`);
      setProduct(res.data.product);
    } catch {
      enqueueSnackbar("Failed to fetch product details", { variant: "error" });
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reviews/product/${productId}`);
      setReviews(res.data.reviews || []);
    } catch {
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
  }, [productId]);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
      : 0;

  const handleChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  // Add or edit review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      enqueueSnackbar("You must be logged in to submit a review", { variant: "warning" });
      return;
    }

    try {
      if (editReview) {
        // Edit review
        const res = await axios.put(
          `${API_BASE}/reviews/edit/${editReview.review_id}`,
          { rating: reviewForm.rating, reviewText: reviewForm.comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update reviews state immediately
        setReviews((prev) =>
          prev.map((r) => (r.review_id === editReview.review_id ? res.data : r))
        );
        enqueueSnackbar("Review updated", { variant: "success" });
        setEditReview(null);
      } else {
        // Add new review
        const res = await axios.post(
          `${API_BASE}/reviews/add`,
          { productId, rating: reviewForm.rating, reviewText: reviewForm.comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Add to reviews immediately
        setReviews((prev) => [...prev, res.data]);
        enqueueSnackbar("Review added", { variant: "success" });
      }

      setReviewForm({ rating: "", comment: "" });
    } catch (err) {
      if (err.response?.status === 400) {
        enqueueSnackbar("You have already reviewed this product.", { variant: "warning" });
      } else {
        enqueueSnackbar(err.response?.data?.message || "Failed to submit review", { variant: "error" });
      }
    }
  };

  const handleEdit = (review) => {
    setEditReview(review);
    setReviewForm({
      rating: review.rating,
      comment: review.comment || review.review_text || "",
    });
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`${API_BASE}/reviews/delete/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove review immediately
      setReviews((prev) => prev.filter((r) => r.review_id !== reviewId));
      if (editReview?.review_id === reviewId) setEditReview(null);

      enqueueSnackbar("Review deleted", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || "Failed to delete review", { variant: "error" });
    }
  };

  if (loading) return <p className="p-4 text-center text-gray-600">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Product Info */}
      {product && (
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row gap-6">
          <img
            src={product?.image?.startsWith("http") ? product.image : product?.image ? `http://localhost:7777/uploads/${product.image}` : "/placeholder.png"}
            alt={product.name}
            className="h-40 object-contain mb-4 cursor-pointer"
            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          />
          <div className="flex-1 flex flex-col justify-between">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mt-3">{product.description}</p>
            <p className="mt-4 font-bold text-lg">Price: ${product.price}</p>
            <p className="mt-1 text-gray-700">Stock: {product.stock}</p>
            {product.ProductSizes?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-1">Available Sizes:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ProductSizes.map((s) => (
                    <span key={s.size_id} className="px-3 py-1 border border-gray-300 rounded-full text-sm bg-gray-50">{s.size}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Review Form */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{editReview ? "Edit Your Review" : "Add a Review"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
            <input type="number" name="rating" min="1" max="5" value={reviewForm.rating} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Your Comment</label>
            <textarea name="comment" value={reviewForm.comment} onChange={handleChange} rows="3" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          </div>
          <button type="submit" className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition">{editReview ? "Update Review" : "Submit Review"}</button>
        </form>
      </div>

      {/* Average Rating */}
      {reviews.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-4">
          <p className="font-bold text-lg">Average Rating: {avgRating} ★ ({reviews.length} {reviews.length > 1 ? "reviews" : "review"})</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => {
              const userName = r.User?.name || "Anonymous";
              const reviewUserId = r.customer_id || r.user_id;
              const isOwnReview = user && reviewUserId === user.id;

              return (
                <div key={r.review_id} className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{userName} ({r.User?.email || "No email"})</p>
                    {isOwnReview && (
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(r)} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition">Edit</button>
                        <button onClick={() => handleDelete(r.review_id)} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition">Delete</button>
                      </div>
                    )}
                  </div>
                  <p className="text-yellow-500 font-semibold mt-1">Rating: {r.rating} ★</p>
                  <p className="text-gray-700 mt-1">Comment: {r.comment || r.review_text}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Viewdetail;
