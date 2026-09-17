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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url?.includes('/admin/login') === false) {
      localStorage.removeItem('adminToken');
      window.location.replace('/admin/login');
    }
    return Promise.reject(error);
  }
);

export default api;
