import axios from 'axios';

const rawBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
const baseURL = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
