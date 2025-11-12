import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaEdit, FaEye, FaEyeSlash } from "react-icons/fa"; // replaced FaUserCircle with FaUser
import { useNavigate } from "react-router-dom";
const API_BASE = "http://localhost:7777/api";

const SellerProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit states
  const [editField, setEditField] = useState(null); // 'name', 'email', 'password'
  const [editValue, setEditValue] = useState("");

  // Password states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError("You must be logged in");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load profile");
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // Handle field edit save
  const handleFieldEdit = async (field) => {
    try {
      await axios.put(
        `${API_BASE}/auth/profile`,
        { [field]: editValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, [field]: editValue });
      setEditField(null);
      setEditValue("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update field");
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      alert("Please fill both fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.put(
        `${API_BASE}/auth/change-password`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      setEditField(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to change password");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-gray-500">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="max-w-lg mx-auto p-8 bg-gray-50 min-h-screen">
       <button
        onClick={() => navigate('/seller')}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        &larr; Back to Dashboard
      </button>
      <h1 className="text-4xl font-bold mb-8 text-gray-800 flex items-center gap-3">
        <FaUser className="text-gray-600" size={42} /> My Profile
      </h1>

      {/* Name Card */}
      <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 flex justify-between items-center">
        <div>
          <strong className="text-gray-700 text-lg">Name:</strong>
          <div className="text-gray-600 text-xl">{user.name}</div>
        </div>
        <FaEdit
          className="text-gray-600 cursor-pointer hover:text-gray-800"
          size={24}
          onClick={() => {
            setEditField("name");
            setEditValue(user.name);
          }}
        />
      </div>

      {/* Email Card */}
      <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 flex justify-between items-center">
        <div>
          <strong className="text-gray-700 text-lg">Email:</strong>
          <div className="text-gray-600 text-xl">{user.email}</div>
        </div>
        <FaEdit
          className="text-gray-600 cursor-pointer hover:text-gray-800"
          size={24}
          onClick={() => {
            setEditField("email");
            setEditValue(user.email);
          }}
        />
      </div>

      {/* Password Card */}
      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <strong className="text-gray-700 text-lg">Password:</strong>
          <FaEdit
            className="text-gray-600 cursor-pointer hover:text-gray-800"
            size={24}
            onClick={() => setEditField("password")}
          />
        </div>
        <div className="text-gray-600">********</div>
      </div>

      {/* Edit Field Modal */}
      {editField && editField !== "password" && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFieldEdit(editField);
            }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-700 flex items-center gap-2">
              <FaEdit className="text-gray-600" /> Edit{" "}
              {editField.charAt(0).toUpperCase() + editField.slice(1)}
            </h2>
            <input
              type={editField === "email" ? "email" : "text"}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
            />
            <div className="flex gap-3 justify-end mt-2">
              <button
                type="submit"
                className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditField(null)}
                className="bg-gray-300 px-5 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Change Password Modal */}
      {editField === "password" && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handlePasswordChange}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-700 flex items-center gap-2">
              <FaUser className="text-gray-600" size={28} /> Change Password
            </h2>

            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="border p-3 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none text-lg"
            />

            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="border p-3 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none text-lg"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-gray-600 hover:text-gray-800 self-start"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} Show/Hide
            </button>

            <div className="flex gap-3 mt-2 justify-end">
              <button
                type="submit"
                className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditField(null);
                  setNewPassword("");
                  setConfirmPassword("");
                  setShowPassword(false);
                }}
                className="bg-gray-300 px-5 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
