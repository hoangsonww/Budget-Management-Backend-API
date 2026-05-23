import axios from 'axios';
import { getToken, isTokenExpired, logout } from './auth';

const api = axios.create({
  baseURL: 'https://budget-management-backend-api.onrender.com',
});

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    // Short-circuit expired tokens client-side so we don't burn a round trip
    // on a request the server will reject. The 401 interceptor below is the
    // fallback for tokens revoked server-side (e.g. blacklist).
    if (isTokenExpired(token)) {
      logout();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(new Error('Token expired'));
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  error => {
    if (error.response && error.response.status === 401) {
      logout();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
