import LoginPage from "./Pages/LoginPage";
import { Routes, Route } from "react-router-dom";

import SellerDashboard from "./Pages/Seller/SellerDashboard";
import AddProduct from "./Pages/Seller/AddProductPage";
import SellerProducts from "./Pages/Seller/SellerProductPage";
import SellerOverview from "./Pages/Seller/SellerOverview";
import SellerOrder from "./Pages/Seller/SellerOrderPage";
import SellerReview from "./Pages/Seller/SellerReviewPage";
import SellerProfile from "./Pages/Seller/SellerProfile";
import EditProductPage from "./Pages/Seller/EditProductPage";
import DeleteMessage from "./Pages/Seller/DeleteMessage";
import Register from "./Pages/RegisterPage";
import Dashboard from "./Pages/customer/dashboard";
import CartDetails from "./Pages/customer/CartDetails";

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />
      <Route path='/' element = {<Register/>} />

      {/* Seller dashboard layout with nested routes */}
      <Route path="/seller" element={<SellerDashboard />}>
        <Route index element={<SellerOverview />} /> {/* Default overview */}
        <Route path="overview" element={<SellerOverview />} />
        <Route path="my-products" element={<SellerProducts />} />
        <Route path="AddProducts" element={<AddProduct />} />
        <Route path="orders" element={<SellerOrder />} />
        <Route path="reviews" element={<SellerReview />} />
        <Route path="profile" element={<SellerProfile />} />
        {/* Add more nested routes for orders, reviews, profile if needed */}
      </Route>
      <Route path="/edit-product/:id" element={<EditProductPage />} />
      <Route path="/delete-product/:id" element={<DeleteMessage />} />
      <Route path='/customer/dashboard' element={<Dashboard/>} />
      <Route path='/customer/cart' element={<CartDetails/>} />
    </Routes>
  );
}

export default App;
