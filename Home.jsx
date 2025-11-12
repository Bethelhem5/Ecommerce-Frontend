import React, { useEffect, useState, useRef } from 'react';
import watch from './watch.png';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:7777/api";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ratings, setRatings] = useState({});
  const debounceRef = useRef();

  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch categories
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        let productsArray = Array.isArray(data) ? data : data.products || [];

        // Ensure every product has category_id for filtering
        productsArray = productsArray.map(p => ({
          ...p,
          category_id: p.category?.id || p.category_id
        }));

        setProducts(productsArray);
        setFiltered(productsArray);

        // Fetch ratings for each product
        const ratingsObj = {};
        await Promise.all(
          productsArray.map(async p => {
            const r = await fetchReviews(p.product_id || p.id);
            ratingsObj[p.product_id || p.id] = r;
          })
        );
        setRatings(ratingsObj);

      } catch (err) {
        console.error(err);
        setProducts([]);
        setFiltered([]);
      }
    };
    fetchProducts();
  }, []);

  const fetchReviews = async (productId) => {
    try {
      const res = await fetch(`${API_BASE}/reviews/product/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch reviews");

      const count = data.reviews?.length || 0;
      const avg = count > 0 ? (data.reviews.reduce((s, r) => s + r.rating, 0) / count).toFixed(1) : 0;
      return { avgRating: avg, reviewCount: count };
    } catch {
      return { avgRating: 0, reviewCount: 0 };
    }
  };

  // Filter products
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      let result = products;

      // Search filter
      if (search.trim()) {
        const s = search.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(s));
      }

      // Category filter
      if (categoryFilter !== "all") {
        const selectedId = Number(categoryFilter);
        result = result.filter(p => p.category_id === selectedId);
      }

      setFiltered(result);
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [search, categoryFilter, products]);

  const handleAddToCart = async (product) => {
    if (!user) return navigate('/login');
    try {
      const res = await fetch(`${API_BASE}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ productId: product.product_id || product.id, quantity: 1 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add to cart");
      alert(`${product.name} added to cart!`);
      navigate('/cart');
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewDetail = (productId) => {
    if (!user) return navigate('/login');
    navigate(`/viewdetail/${productId}`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 font-sans flex flex-col items-start">

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between bg-gray-800 w-full p-6 lg:p-12 rounded-b-xl">
        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold w-full lg:w-2/3 mb-4 lg:mb-0">
          Explore the latest digital electronics from top brands
        </h2>
        <img src={watch} alt="Watch-img" className="w-full lg:w-1/3 h-48 lg:h-auto object-cover" />
      </div>

      {/* Search & Categories */}
      <div className="w-full flex flex-col sm:flex-row justify-center items-center mt-6 mb-4 gap-4 px-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products"
          className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
       
      </div>

      {/* Product List */}
      <div className="w-full flex flex-wrap justify-center gap-6 p-4 sm:p-8">
        {products.length === 0 ? (
          <div className="text-gray-500 text-xl">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500 text-xl">No products found.</div>
        ) : (
          filtered.map(p => {
            const r = ratings[p.product_id || p.id] || { avgRating: 0, reviewCount: 0 };
            return (
              <div key={p.product_id || p.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6 w-full sm:w-80 md:w-72 flex flex-col items-center">
                <div onClick={() => handleViewDetail(p.product_id || p.id)} className="cursor-pointer w-full">
                  <img src={p.imageUrl || "/placeholder.png"} alt={p.name} className="h-40 sm:h-48 md:h-40 w-full object-contain mb-4" onError={e => e.currentTarget.src="/placeholder.png"} />
                </div>
                <h3 className="text-lg font-semibold mb-1 text-gray-800 text-center">{p.name}</h3>
                <p className="text-yellow-500 font-semibold mb-1 text-center">
                  {r.avgRating} ★ ({r.reviewCount})                                                                  
                </p>
                <span className="text-blue-600 font-bold text-xl mb-2">ETB{p.price}</span>
                <button
                  onClick={() => handleAddToCart(p)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition w-full font-semibold"
                >
                  Add to Cart
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Home;
