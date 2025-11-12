import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../../services/api";
import Navbar from "../../Components/Navbar";

const ShippingPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const res = await api.get("/addresses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const addrList = res.data.addresses || [];
      setAddresses(addrList);

      if (addrList.length > 0) {
        const defaultAddress = addrList.find((a) => a.is_default);
        setSelectedAddressId(
          defaultAddress?.address_id || addrList[0].address_id
        );
      }
    } catch (err) {
      console.error(err);
      setAddresses([]);
      enqueueSnackbar("Failed to load addresses", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleContinue = () => {
    if (!selectedAddressId) {
      enqueueSnackbar("Please select a shipping address", {
        variant: "warning",
      });
      return;
    }
    navigate(`/checkout/payment?addressId=${selectedAddressId}`);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/addresses", newAddress, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      enqueueSnackbar("Address added successfully", { variant: "success" });
      setNewAddress({
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      });
      setShowAddForm(false);
      fetchAddresses(); // refresh list
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to add address", { variant: "error" });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>

        {/* Address selection */}
        {Array.isArray(addresses) && addresses.length > 0 ? (
          <div className="mb-4">
            <label className="block font-semibold mb-1">Select Address:</label>
            <select
              className="w-full border p-2 rounded"
              value={selectedAddressId || ""}
              onChange={(e) => setSelectedAddressId(Number(e.target.value))}
            >
              {addresses.map((addr) => (
                <option key={addr.address_id} value={addr.address_id}>
                  {addr.street}, {addr.city}, {addr.state} - {addr.country}
                  {addr.is_default ? " (Default)" : ""}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="mb-4 text-gray-600">
            No addresses found. Please add one.
          </p>
        )}

        {/* Add new address form */}
        {showAddForm ? (
          <form
            onSubmit={handleAddAddress}
            className="border p-4 rounded mb-4 space-y-3 bg-gray-50"
          >
            <h3 className="font-semibold text-lg mb-2">Add New Address</h3>
            <input
              type="text"
              placeholder="Street"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={newAddress.postal_code}
              onChange={(e) =>
                setNewAddress({ ...newAddress, postal_code: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Country"
              value={newAddress.country}
              onChange={(e) =>
                setNewAddress({ ...newAddress, country: e.target.value })
              }
              className="w-full border p-2 rounded"
              required
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Save Address
              </button>
            </div>
          </form>
        ) : (
          <button
            className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => setShowAddForm(true)}
          >
            + Add New Address
          </button>
        )}

        {/* Continue button */}
        <button
          className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 mt-4 disabled:bg-gray-400"
          onClick={handleContinue}
          disabled={!selectedAddressId}
        >
          Continue to Payment
        </button>
      </div>
    </>
  );
};

export default ShippingPage;
