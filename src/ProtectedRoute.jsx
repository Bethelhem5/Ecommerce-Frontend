import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// role: 'admin', 'user', or 'seller'
const ProtectedRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Not authorized for this route
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
