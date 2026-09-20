import React, { useState, useEffect } from 'react';
import { AuthContext } from './authContext';

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('adminToken');
    return !!token;
  });

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  const login = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}