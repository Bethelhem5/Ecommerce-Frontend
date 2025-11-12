import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdEdit, MdAdd, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  // Show success message
  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  };

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:7777/api/categories");
      const cats = res.data.categories.map((cat) => ({
        categoryId: cat.category_id,
        name: cat.name,
      }));
      setCategories(cats);
    } catch (err) {
      setError("Failed to fetch categories");
    }
    setLoading(false);
  };

  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:7777/api/categories", { name: newCategory });
      setNewCategory("");
      showSuccess("Category added successfully!");
      fetchCategories(); // refetch updated list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add category");
    }
    setLoading(false);
  };

  // Start editing category
  const handleEditCategory = (id, name) => {
    setEditId(id);
    setEditValue(name);
  };

  // Update category
  const handleUpdateCategory = async (categoryId) => {
    if (!editValue.trim() || !categoryId) return;
    setLoading(true);
    setError("");
    try {
      await axios.put(`http://localhost:7777/api/categories/${categoryId}`, { name: editValue });
      setEditId(null);
      setEditValue("");
      showSuccess("Category updated successfully!");
      fetchCategories(); // refetch updated list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update category");
    }
    setLoading(false);
  };

  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    if (!categoryId) return;
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://localhost:7777/api/categories/${categoryId}`);
      showSuccess("Category deleted successfully!");
      fetchCategories(); // refetch updated list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete category");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        &larr; Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-4">Categories</h2>

      {/* Add Category */}
      <form onSubmit={handleAddCategory} className="flex gap-4 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
          placeholder="Add new category"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          disabled={loading}
        >
          <MdAdd size={20} />
        </button>
      </form>

      {/* Error & Success Messages */}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      {/* Categories List */}
      <ul className="bg-white rounded shadow divide-y">
        {categories.map((cat) => (
          <li
            key={cat.categoryId}
            className="flex items-center justify-between px-4 py-2"
          >
            {editId === cat.categoryId ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="border rounded px-2 py-1 flex-1 mr-2"
                  autoFocus
                />
                <button
                  onClick={() => handleUpdateCategory(cat.categoryId)}
                  className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700"
                  disabled={loading}
                >
                  Save
                </button>
                <button
                  onClick={() => { setEditId(null); setEditValue(""); }}
                  className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  disabled={loading}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{cat.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCategory(cat.categoryId, cat.name)}
                    className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                    disabled={loading}
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.categoryId)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    disabled={loading}
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {loading && <div className="mt-4 text-gray-600">Loading...</div>}
    </div>
  );
}
