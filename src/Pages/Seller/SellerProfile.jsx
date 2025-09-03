import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useSnackbar } from "notistack";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const { enqueueSnackbar } = useSnackbar();

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProfile(res.data.user);
        setFormData({ name: res.data.user.name, email: res.data.user.email });
        setLoading(false);
      } catch (err) {
        console.error(err);
        enqueueSnackbar("Failed to load profile", { variant: "error" });
      }
    };
    fetchProfile();
  }, []);

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/auth/profile", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      enqueueSnackbar("Profile updated successfully", { variant: "success" });
      setProfile(res.data.user);
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to update profile", { variant: "error" });
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/profile/change-password", passwordData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      enqueueSnackbar("Password changed successfully", { variant: "success" });
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to change password", { variant: "error" });
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-8">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {/* Profile Info */}
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          Update Profile
        </button>
      </form>

      {/* Password Change */}
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <div>
          <label className="block font-medium">Old Password</label>
          <input
            type="password"
            value={passwordData.oldPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, oldPassword: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">New Password</label>
          <input
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
