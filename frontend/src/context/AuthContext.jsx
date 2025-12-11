// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // { id, username, email, is_admin, ... }
  const [loading, setLoading] = useState(true);

  // Restore auth state on reload
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser && savedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login (works for both user and admin)
  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { token, user: userData } = response.data; // userData includes is_admin

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  // Signup (new accounts are normal users; is_admin=false from backend)
  const signup = async (userData) => {
    const response = await authAPI.signup(userData);
    const { token, user: newUser } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);

    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: !!user?.is_admin,   // helper: true only for admin accounts
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
