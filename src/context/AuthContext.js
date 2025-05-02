import React, { createContext, useState, useEffect } from 'react';

// Create Context
export const AuthContext = createContext();

// AuthProvider component to wrap the app and manage authentication state
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth({ isAuthenticated: true });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuth({ isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
