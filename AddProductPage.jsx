import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import { useSnackbar } from "notistack";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    sizes: [],
    image: null,
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [categories, setCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.categories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (name === "sizes") {
      // Handle size checkboxes
      setFormData((prev) => {
        const newSizes = checked
          ? [...prev.sizes, value]
          : prev.sizes.filter((s) => s !== value);
        return { ...prev, sizes: newSizes };
      });
    } else if (type === "file") {
      const selectedFile = files && files[0] ? files[0] : null;
      setFormData((prev) => ({ ...prev, image: selectedFile }));
      if (selectedFile) {
        const objectUrl = URL.createObjectURL(selectedFile);
        setImagePreviewUrl(objectUrl);
      } else {
        setImagePreviewUrl(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category_id", formData.category_id);
      data.append("sizes", JSON.stringify(formData.sizes)); // send as JSON string
      if (formData.image) data.append("image", formData.image);

      const res = await api.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      enqueueSnackbar("Product added successfully!", { variant: "success" });

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
        sizes: [],
        image: null,
      });
      setImagePreviewUrl(null);

      // Navigate to seller's products page after a short delay
      setTimeout(() => {
        navigate("/seller/my-products");
      }, 1500);
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.response?.data?.message || "Failed to add product", {
        variant: "error",
      });
    }
  };

  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
       <button
        onClick={() => navigate('/seller')}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        &larr; Back to Dashboard
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Add Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-gray-400"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-gray-400"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <label key={size} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="sizes"
                  value={size}
                  checked={formData.sizes.includes(size)}
                  onChange={handleChange}
                />
                {size}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
          {imagePreviewUrl && (
            <div className="mt-3">
              <img
                src={imagePreviewUrl}
                alt="Selected preview"
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
