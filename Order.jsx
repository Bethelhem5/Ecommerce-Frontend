import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../seller/services/api";
import Navbar from "../components/Navbar"

const Order = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });
  const [method, setMethod] = useState("cod");
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const res = await api.get("/addresses");
      const addrList = res.data.addresses || [];
      setAddresses(addrList);
      if (addrList.length > 0) {
        const defaultAddress = addrList.find((a) => a.is_default);
        setSelectedAddressId(
          defaultAddress?.address_id || addrList[0].address_id
        );
      }
    } catch {
      enqueueSnackbar("Failed to load addresses", { variant: "error" });
    }
  };

  // Fetch cart total
  const fetchCartTotal = async () => {
    try {
      const res = await api.get("/cart/");
      const items = res.data.items || [];
      setCartItems(items);
      const calculatedTotal = items.reduce(
        (sum, item) => sum + item.quantity * item.Product.price,
        0
      );
      setTotal(calculatedTotal);
    } catch {
      enqueueSnackbar("Failed to load cart total", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchCartTotal();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/addresses", newAddress);
      enqueueSnackbar("Address added successfully", { variant: "success" });
      setSelectedAddressId(res.data.address.address_id);
      setNewAddress({
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      });
      setShowAddForm(false);
      fetchAddresses();
    } catch {
      enqueueSnackbar("Failed to add address", { variant: "error" });
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      enqueueSnackbar("Please select a shipping address", {
        variant: "warning",
      });
      return;
    }

    try {
      const res = await api.post("/payments/initialize", {
        addressId: selectedAddressId,
        method,
      });

      if (method === "chapa") {
        // Redirect user to Chapa checkout
        window.location.href = res.data.checkout_url;
      } else {
        // COD: order created immediately
        enqueueSnackbar("Order placed successfully (COD)", {
          variant: "success",
        });
        navigate("/customer/orders");
      }
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || "Failed to place order", {
        variant: "error",
      });
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-3xl mx-auto space-y-6">
          <button
        onClick={() => navigate('/cart')}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        &larr; Back 
      </button>
        <h2 className="text-2xl font-bold mb-4"> Payment</h2>

        {/* Address Selection */}
        {addresses.length > 0 ? (
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

        {/* Add New Address Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddAddress}
            className="border p-4 rounded mb-4 bg-gray-50 space-y-3"
          >
            <h3 className="font-semibold text-lg">Add New Address</h3>
            {["street", "city", "state", "postal_code", "country"].map(
              (field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.replace("_", " ").toUpperCase()}
                  value={newAddress[field]}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, [field]: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  required={field !== "state"}
                />
              )
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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
        )}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            + Add New Address
          </button>
        )}

        {/* Payment Method */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">
            Select Payment Method:
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="cod"
                checked={method === "cod"}
                onChange={(e) => setMethod(e.target.value)}
              />{" "}
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="chapa"
                checked={method === "chapa"}
                onChange={(e) => setMethod(e.target.value)}
              />{" "}
              Chapa
            </label>
          </div>
        </div>

        {/* Cart Breakdown */}
      
        
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 mt-4"
        >
          Place Order
        </button>
      </div>
    </>
  );
};

export default Order;
