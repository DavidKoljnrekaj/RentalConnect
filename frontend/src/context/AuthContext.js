import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // Load authentication state from localStorage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (storedUser && storedRole) {
      setUser(storedUser);
      setRole(storedRole)
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', userData.token); // Store token directly
    localStorage.setItem('role', userData.role); // Store role directly
    console.log('context user', userData.token);
    console.log('context role', userData.role);
    setUser(userData.token); // Set token in state
    setRole(userData.role); // Set role in state
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null)
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
