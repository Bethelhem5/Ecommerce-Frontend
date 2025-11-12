import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle, FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:7777/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
      <div className="flex justify-center items-center min-h-screen text-red-500 text-center px-4">
        {error}
      </div>
    );

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800 flex items-center gap-3 justify-center sm:justify-start">
        <FaUserCircle className="text-gray-500" size={36} /> My Profile
      </h1>

      {/* Name & Email Card */}
      {["name", "email"].map((field) => (
        <div
          key={field}
          className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl mb-4 sm:mb-6 flex justify-between items-center"
        >
          <div className="flex flex-col gap-1">
            <strong className="text-gray-700 capitalize">{field}:</strong>
            <span className="text-gray-600 text-lg sm:text-xl">{user[field]}</span>
          </div>
          <FaEdit
            className="text-gray-800 cursor-pointer hover:text-gray-900"
            size={20}
            onClick={() => {
              setEditField(field);
              setEditValue(user[field]);
            }}
          />
        </div>
      ))}

      {/* Password Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl mb-4 sm:mb-6 flex justify-between items-center">
        <div>
          <strong className="text-gray-700">Password:</strong>
          <div className="text-gray-600">********</div>
        </div>
        <FaEdit
          className="text-gray-800 cursor-pointer hover:text-gray-900"
          size={20}
          onClick={() => setEditField("password")}
        />
      </div>

      {/* Edit Field Modal */}
      {editField && editField !== "password" && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFieldEdit(editField);
            }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-4"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-700 flex items-center gap-2">
              <FaEdit /> Edit {editField}
            </h2>
            <input
              type={editField === "email" ? "email" : "text"}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-base sm:text-lg w-full"
            />
            <div className="flex gap-3 justify-end mt-2 flex-wrap">
              <button
                type="submit"
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditField(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Change Password Modal */}
      {editField === "password" && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handlePasswordChange}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-4"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-700 flex items-center gap-2">
              <FaUserCircle className="text-gray-600" size={24} /> Change Password
            </h2>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="border p-3 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none text-base sm:text-lg"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="border p-3 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none text-base sm:text-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm sm:text-base text-gray-600 hover:text-gray-800 self-start"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} Show/Hide
            </button>
            <div className="flex gap-3 mt-2 justify-end flex-wrap">
              <button
                type="submit"
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
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
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => navigate("/customer/orders")}
        className="mt-6 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 w-full sm:w-auto block mx-auto sm:mx-0"
      >
        View My Orders
      </button>
    </div>
  );
};

export default Profile;
