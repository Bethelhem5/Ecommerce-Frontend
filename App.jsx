// ...existing code...

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Order from './pages/Order';
import Viewdetail from './components/Viewdetail';
import Addreview from './components/Addreview';
import Dashboard from './Admin/Dashboard';
import AuthProvider from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import SellerManagement from './Admin/SellerManagement';
import Categories from './Admin/categories';
import UserManagement from './Admin/UserManagement';
import SellerDashboard from './seller/SellerDashboard';
import SellerOverview from './seller/SellerOverview';
import SellerProductPage from './seller/SellerProductPage';
import SellerReviewPage from './seller/SellerReviewPage';
import SellerProfile from './seller/SellerProfile';
import AddProductPage from './seller/AddProductPage'
import SellerOrderPage from './seller/SellerOrderPage'
import Report from './Admin/Report';
import PaymentResult from './pages/PaymentResult';
import CustomerOrdersPage from './CustomerOrdersPage';
import ConfirmPage from './ConfirmPage';

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <div className="pt-20"> {/* Add padding to avoid overlap with fixed navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/order' element={<Order/>}/>
          <Route path="/viewdetail/:productId" element={<Viewdetail />} />
          <Route path="/viewdetail/:productId/rate" element={<Addreview />} />
          <Route path="/payment-result" element={<PaymentResult/>} />
          <Route path="/customer/orders"  element={<CustomerOrdersPage/>}/>
          <Route path="/confrim" element={<ConfirmPage/>}/>
          {/* Protected admin dashboard route */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}> 
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/sellers" element={<SellerManagement/>} />
            <Route path="/categories" element={<Categories/>}/>
            <Route path="/users" element={<UserManagement/>}/>
            <Route path="/reports" element={<Report/>}/>
          </Route>
          <Route element={<ProtectedRoute allowedRoles={'seller'}/>}>
          <Route path='seller' element={<SellerDashboard/>}/>
          <Route path="/seller/overview" element={<SellerOverview/>}/>
          <Route path="/seller/my-products" element={<SellerProductPage/>}/>
          <Route path="/seller/add-products" element={<AddProductPage/>}/>
          <Route path="/seller/orders" element={<SellerOrderPage/>}/>
          <Route path="/seller/reviews" element={<SellerReviewPage/>}/>
          <Route path="/seller/profile" element={<SellerProfile/>}/>

          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
