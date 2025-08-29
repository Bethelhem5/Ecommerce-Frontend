import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // login: fetch user info and role from backend, map role 1=admin, 2=seller, else user
  const login = async (userData) => {
    try {
      // Replace with your backend endpoint for user info
      const res = await fetch('http://localhost:7777/api/auth/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email })
      });
      if (!res.ok) throw new Error('User info fetch failed');
      const userInfo = await res.json();
      let role = 'user';
      if (userInfo.role === 1) role = 'admin';
      else if (userInfo.role === 2) role = 'seller';
      const userWithRole = { ...userData, ...userInfo, role };
      setUser(userWithRole);
      localStorage.setItem('user', JSON.stringify(userWithRole));
    } catch (err) {
      setUser(userData); // fallback
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
