
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const Addreview = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { id } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ rating, comment });
    }
    setRating(5);
    setComment('');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mt-24">
      <div className="w-full max-w-md mb-2">
        <Link to={`/viewdetail/${id}`} className="inline-block">
          <span className="text-xl text-gray-700 hover:text-blue-600 font-medium">&larr; Back</span>
        </Link>
      </div>
      <h2 className="text-3xl font-extrabold text-gray-700 mb-8 text-center">Add Your Review</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <div className="mb-4">
            
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
            Rating
          </label>
          <select
            id="rating"
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {[1,2,3,4,5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
            Comment
          </label>
          <textarea
            id="comment"
            placeholder="Comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-[100px] resize-y"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default Addreview;

