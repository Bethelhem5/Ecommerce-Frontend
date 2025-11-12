import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const normalizeUser = (rawUser) => {
    if (!rawUser) return null;
    let role = 'customer';
    if (typeof rawUser.role === 'string') {
      const lower = rawUser.role.toLowerCase();
      if (['admin', 'seller', 'customer'].includes(lower)) role = lower;
    } else if (Array.isArray(rawUser.roles)) {
      const lowerRoles = rawUser.roles.map((r) =>
        typeof r === 'string' ? r.toLowerCase() : (r?.name || r?.type || '').toLowerCase()
      );
      if (lowerRoles.includes('admin')) role = 'admin';
      else if (lowerRoles.includes('seller')) role = 'seller';
    } else if (rawUser.isAdmin === true) {
      role = 'admin';
    } else if (rawUser.isSeller === true) {
      role = 'seller';
    }
    return { ...rawUser, role };
  };

  const decodeJwtPayload = (token) => {
    try {
      const base64 = token.split('.')[1];
      if (!base64) return null;
      const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch (_) {
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:7777/api/auth/login', { email, password });

      const data = response.data ?? {};
      let candidateUser = data.user ?? data.data ?? (typeof data.role !== 'undefined' ? data : null) ?? null;
      const candidateToken = data.token ?? data.accessToken ?? data.jwt ?? null;

      if (!candidateUser && candidateToken) {
        const payload = decodeJwtPayload(candidateToken);
        if (payload) {
          let derivedRole = 'customer';
          if (typeof payload.role === 'string') derivedRole = payload.role.toLowerCase();
          if (Array.isArray(payload.roles)) {
            const lr = payload.roles.map((r) =>
              typeof r === 'string' ? r.toLowerCase() : (r?.name || r?.type || '').toLowerCase()
            );
            if (lr.includes('admin')) derivedRole = 'admin';
            else if (lr.includes('seller')) derivedRole = 'seller';
          }
          if (payload.isAdmin === true) derivedRole = 'admin';
          if (payload.isSeller === true) derivedRole = 'seller';

          candidateUser = {
            id: payload.sub || payload.user_id || payload.id || payload.uid || undefined,
            email: payload.email || undefined,
            role: derivedRole,
          };
        }
      }

      const normalizedUser = normalizeUser(candidateUser);

      if (candidateToken) {
        localStorage.setItem('token', candidateToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${candidateToken}`;
      }

      if (normalizedUser) {
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        setIsAuthenticated(true);
        setLoading(false);
        console.log('API login response:', data);
        console.log('Normalized user:', normalizedUser);
        return { success: true, user: normalizedUser, token: candidateToken };
      }

      setLoading(false);
      return { success: false, message: 'Invalid login response from server' };
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      setLoading(false);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:7777/api/auth/register', { name, email, password });
      const { token, user: rawUser } = response.data;
      const normalizedUser = normalizeUser(rawUser);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(normalizedUser);
      setIsAuthenticated(true);
      setLoading(false);

      return { success: true, user: normalizedUser };
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      setLoading(false);
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserRaw = localStorage.getItem('user');
    if (storedUserRaw) {
      try {
        const parsed = JSON.parse(storedUserRaw);
        const normalized = normalizeUser(parsed);
        setUser(normalized);
        setIsAuthenticated(true);
      } catch (_) {
        localStorage.removeItem('user');
      }
    }
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const value = { user, isAuthenticated, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export default AuthProvider; // ✅ default export
