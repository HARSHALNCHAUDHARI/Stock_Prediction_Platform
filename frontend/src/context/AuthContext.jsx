import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  
  console.log('🔍 Checking localStorage on mount...');
  console.log('Token:', token);
  console.log('User:', savedUser);
  
  if (token && savedUser && savedUser !== 'undefined') {  // ADD THIS CHECK
    try {
      setUser(JSON.parse(savedUser));
      console.log('✅ User restored');
    } catch (e) {
      console.error('❌ Error parsing user:', e);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
  setLoading(false);
}, []);


  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { token, user: userData } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    return userData;
  };

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
