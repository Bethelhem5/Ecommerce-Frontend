import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../../../services/api";

const DeleteMessage = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      enqueueSnackbar("Product deleted successfully", { variant: "success" });
      navigate("seller/My-products"); // Redirect back to the products page
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to delete product", { variant: "error" });
      navigate("/seller-products"); // Redirect even on error to avoid staying on the page
    }
  };

  const handleCancel = () => {
    navigate("/seller/My-products"); // Redirect back to the products page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Confirm Deletion
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Are you sure you want to delete this product? This action cannot be
          undone.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleConfirmDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMessage;
