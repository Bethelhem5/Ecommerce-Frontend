// ...existing code...
const RateProduct = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Rate & Comment</h2>
      <p className="text-lg">This is a placeholder for the rating and comment form.</p>
    </div>
  );
};

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

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="pt-20"> {/* Add padding to avoid overlap with fixed navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/order' element={<Order/>}/>
          <Route path="/viewdetail/:id" element={<Viewdetail />} />
          <Route path="/viewdetail/:id/rate" element={<Addreview />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
