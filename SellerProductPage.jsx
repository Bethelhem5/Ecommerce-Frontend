import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE = "http://localhost:7777/api";

const SellerProductPage = () => {
  const [myProducts, setMyProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });
  const navigate = useNavigate();
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_BASE}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sellerId = parseInt(localStorage.getItem("sellerId"), 10);
        if (sellerId && !isNaN(sellerId)) {
          const filtered = res.data.products.filter(
            (p) => p.seller_id === sellerId
          );
          setMyProducts(filtered);
        } else {
          setMyProducts(res.data.products || []);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setFormData({ ...formData, image: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  // Open edit modal
  const handleEditClick = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: null,
    });
  };

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!editProduct) return;

      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("stock", formData.stock);
      if (formData.image) form.append("image", formData.image); // must match multer field

      const productId = editProduct.product_id || editProduct.id;

      const res = await axios.put(`${API_BASE}/products/${productId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedProduct = res.data.product || res.data;

      setMyProducts((prev) =>
        prev.map((p) =>
          (p.product_id || p.id) === (updatedProduct.product_id || updatedProduct.id)
            ? updatedProduct
            : p
        )
      );

      setEditProduct(null);
    } catch (err) {
      console.error("Edit product error:", err);
      alert(err.response?.data?.message || "Failed to update product");
    }
  };

  // Delete product
  const handleDeleteClick = (productId) => setDeleteProductId(productId);

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      const productId = deleteProductId;
      if (!productId) return;

      const res = await axios.delete(`${API_BASE}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setMyProducts((prev) =>
          prev.filter((p) => (p.product_id || p.id) !== productId)
        );
        setDeleteProductId(null);
      } else {
        alert(res.data?.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
       <button
        onClick={() => navigate('/seller')}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        &larr; Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-6">My Products</h1>

      {myProducts.length === 0 ? (
        <p className="text-gray-500">No products found for your account.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myProducts.map((product, index) => (
            <li
              key={product.product_id || `product-${index}`}
              className="border rounded-lg shadow bg-white p-4"
            >
              <img
                src={product.imageUrl || `/uploads/${product.image}`}
                alt={product.name}
                className="h-32 w-full object-contain mb-4"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-gray-600 text-sm">{product.description}</p>
              <p className="text-gray-800 font-bold">${product.price}</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
                  onClick={() => handleEditClick(product)}
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteClick(product.product_id || product.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded-lg w-full max-w-md flex flex-col gap-4"
          >
            <h2 className="text-xl font-bold">Edit Product</h2>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="border p-2 rounded"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="border p-2 rounded"
              required
            />
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-2 rounded"
              required
            />
            <input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="border p-2 rounded"
              required
            />
            <input
              name="image"
              type="file"
              onChange={handleChange}
              accept="image/*"
              className="border p-2 rounded"
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setEditProduct(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Modal */}
      {deleteProductId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4">Delete Product?</h2>
            <p className="mb-4">Are you sure you want to delete this product?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setDeleteProductId(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductPage;
