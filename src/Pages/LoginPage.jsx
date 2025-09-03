import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../../services/api";
import React from "react";
// Alert Component
function Alert({ message }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      {message}
    </div>
  );
}

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      // Save token & user info
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      if (user.role === "seller") {
        enqueueSnackbar("Login successful", {
          variant: "success",
          autoHideDuration: 1000,
        });
        setTimeout(() => {
          navigate("/seller");
        }, 500);
      } else if (user.role === "customer") {
        enqueueSnackbar("Login successful", {
          variant: "success",
          autoHideDuration: 1000,
        });
        setTimeout(() => {
          navigate("/customer/dashboard");
        }, 500);
      } else {
        setError("You are not authorized to access this portal.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userInfo");
        enqueueSnackbar("Unauthorized access", {
          variant: "error",
          autoHideDuration: 1000,
        });
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
          Login
        </h2>

        {error && <Alert message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
