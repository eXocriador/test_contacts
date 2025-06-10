import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authApi.get('/current');
      setUser(response.data.data);
      setIsAuthenticated(true);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authApi.post('/login', credentials);
    setUser(response.data.data);
    setIsAuthenticated(true);
    return response.data;
  };

  const register = async (userData) => {
    const response = await authApi.post('/register', userData);
    setUser(response.data.data);
    setIsAuthenticated(true);
    return response.data;
  };

  const logout = async () => {
    await authApi.post('/logout');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
