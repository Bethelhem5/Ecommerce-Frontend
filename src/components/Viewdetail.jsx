
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';


const Viewdetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  // Load comments from localStorage for this product
  useEffect(() => {
    const stored = localStorage.getItem(`comments_${id}`);
    if (stored) {
      setComments(JSON.parse(stored));
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-gray-500">Loading...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl flex flex-col items-center">
        <img src={product.image} alt={product.title} className="h-64 object-contain mb-6" />
        <h2 className="text-3xl font-bold mb-2 text-center">{product.title}</h2>
        <p className="text-gray-600 text-center mb-2">{product.category}</p>
        <span className="text-blue-600 font-bold text-2xl mb-2">${product.price}</span>
        <p className="text-gray-700 text-lg my-4 text-center">{product.description}</p>
        {product.rating && (
          <div className="flex items-center mb-4">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-gray-700 font-medium">{product.rating.rate}</span>
            <span className="text-gray-500 text-sm ml-2">({product.rating.count} ratings)</span>
          </div>
        )}
        <Link to={`/viewdetail/${id}/rate`} className="mt-4 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-700 transition font-semibold">
          Addreview
        </Link>
      </div>
      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl mt-8">
        <h3 className="text-xl font-bold mb-4">Comments</h3>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c, idx) => (
              <li key={idx} className="border-b pb-2">
                <div className="flex items-center mb-1">
                  <span className="text-yellow-400 mr-2">★ {c.rating}</span>
                  <span className="text-gray-700 font-semibold">{c.user || 'Anonymous'}</span>
                </div>
                <p className="text-gray-700">{c.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Viewdetail;
