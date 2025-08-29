import React, { useEffect, useState, useRef } from 'react';
import watch from './watch.png';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const debounceRef = useRef();

  useEffect(() => {
    fetch('https://localhost:7777/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFiltered(data);
      });
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!search.trim()) {
        setFiltered(products);
      } else {
        setFiltered(
          products.filter(
            p =>
              p.title.toLowerCase().includes(search.toLowerCase()) ||
              p.category.toLowerCase().includes(search.toLowerCase())
          )
        );
      }
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search, products]);

  return (
    <div className="w-full min-h-screen bg-gray-100 font-sans flex flex-col items-start">
      <div className="flex items-center justify-between bg-gray-800 w-full p-8 rounded-b-xl">
        <h2 className="text-white text-7xl font-extrabold w-2/3">
          Explore the latest digital electronics from top brands
        </h2>
        <img 
          src={watch} 
          alt="Watch-img" 
          className="w-1/3 object-cover"
        />
      </div>

      {/* Search Bar */}
      <div className="w-full flex justify-center mt-8 mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by product or category..."
          className="w-1/3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      {/* Product List Section */}
      <div className="w-full flex flex-wrap gap-8 p-8 justify-center bg-gray-100">
        {products.length === 0 ? (
          <div className="text-gray-500 text-xl">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500 text-xl">No products found.</div>
        ) : (
          filtered.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6 w-72 flex flex-col items-center">
              <Link to={`/viewdetail/${product.id}`}>
                <img src={product.image} alt={product.title} className="h-40 object-contain mb-4 cursor-pointer" />
              </Link>
              {/* Ratings under image */}
              {product.rating && (
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-gray-700 font-medium">{product.rating.rate}</span>
                  <span className="text-gray-500 text-sm ml-2">({product.rating.count})</span>
                </div>
              )}
              <h3 className="text-lg font-semibold mb-2 text-gray-800 text-center">{product.title}</h3>
              <p className="text-gray-600 text-center mb-2">{product.category}</p>
              <span className="text-blue-600 font-bold text-xl mb-2">${product.price}</span>
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition w-full font-semibold"
                onClick={() => {
                  const user = JSON.parse(localStorage.getItem('user'));
                  if (!user) {
                    navigate('/login');
                    return;
                  }
                  const cart = JSON.parse(localStorage.getItem('cart')) || [];
                  // Prevent duplicate items (by id)
                  if (!cart.find(item => item.id === product.id)) {
                    cart.push({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      image: product.image
                    });
                    localStorage.setItem('cart', JSON.stringify(cart));
                  }
                }}
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
