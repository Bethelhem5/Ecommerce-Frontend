import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { useSnackbar } from "notistack";

const EditProductPage = () => {
  const { id } = useParams(); // product ID from URL
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    sizes: [], // sizes array
    image: null, // new uploaded image
  });

  // Fetch product info
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const p = res.data.product;

      setProduct({
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        category_id: p.category_id,
        sizes: p.ProductSizes.map((s) => s.size),
        image: null, // initially no new image
        currentImage: p.image, // keep track of existing image
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to fetch product", { variant: "error" });
    }
  };

  // Fetch categories for select dropdown
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to fetch categories", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle sizes input (comma-separated)
  const handleSizesChange = (e) => {
    const sizesArr = e.target.value.split(",").map((s) => s.trim());
    setProduct({ ...product, sizes: sizesArr });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const handleCancel = () => {
    navigate("/seller/my-products"); // Redirect back to the products page
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("category_id", product.category_id);
      formData.append("sizes", JSON.stringify(product.sizes));
      if (product.image) formData.append("image", product.image);

      await api.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      enqueueSnackbar("Product updated successfully", { variant: "success" });
      navigate("/seller/my-products");
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to update product", { variant: "error" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Stock</label>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <select
            name="category_id"
            value={product.category_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Sizes (comma-separated)</label>
          <input
            type="text"
            value={product.sizes.join(", ")}
            onChange={handleSizesChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Image</label>
          {product.currentImage && (
            <img
              src={`http://localhost:7777/uploads/${product.currentImage}`}
              alt={product.name}
              className="h-32 w-32 object-cover rounded mb-2"
            />
          )}
          <input type="file" onChange={handleImageChange} />
        </div>

        <button
          type="submit"
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          Update Product
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 ml-7"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
