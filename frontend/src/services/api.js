import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// Stock APIs
export const stockAPI = {
  search: (query) => api.get(`/stocks/search?q=${query}`),
  getInfo: (symbol) => api.get(`/stocks/info/${symbol}`),
  getHistorical: (symbol, period = '1y') => api.get(`/stocks/historical/${symbol}?period=${period}`),
  getRealtime: (symbol) => api.get(`/stocks/realtime/${symbol}`),
  getTrending: () => api.get('/stocks/trending'),
  getWatchlist: () => api.get('/stocks/watchlist'),
  addToWatchlist: (symbol) => api.post('/stocks/watchlist', { symbol }),
  removeFromWatchlist: (id) => api.delete(`/stocks/watchlist/${id}`),
};

// Prediction APIs
export const predictionAPI = {
  predict: (symbol) => api.get(`/predictions/predict/${symbol}`),
  getHistory: (limit = 20) => api.get(`/predictions/history?limit=${limit}`),
  getAccuracy: (symbol) => api.get(`/predictions/accuracy/${symbol}`),
};

// Trading APIs
export const tradingAPI = {
  getBalance: () => api.get('/trading/balance'),
  buy: (symbol, quantity) => api.post('/trading/buy', { symbol, quantity }),
  sell: (symbol, quantity) => api.post('/trading/sell', { symbol, quantity }),
  getPortfolio: () => api.get('/trading/portfolio'),
  getTransactions: (limit = 50) => api.get(`/trading/transactions?limit=${limit}`),
};

export default api;
