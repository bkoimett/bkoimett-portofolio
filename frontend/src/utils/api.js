import axios from 'axios';

let rawBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
// Guard: if bundle was built with localhost but served on vercel.app, fall back to relative /api (proxied via vercel.json)
if (rawBase.includes('localhost') && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
  rawBase = '/api';
}
const baseURL = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/admin/login')) {
      localStorage.removeItem('adminToken');
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
