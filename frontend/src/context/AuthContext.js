import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // Load authentication state from localStorage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId'); 
    if (storedUser && storedRole) {
      setUser(storedUser);
      setRole(storedRole);
      setUserId(storedUserId)
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', userData.token); // Store token directly
    localStorage.setItem('role', userData.role); // Store role directly
    localStorage.setItem('userId', userData.userId); // Store role directly
    console.log('context user', userData.token);
    console.log('context role', userData.role);
    setUser(userData.token); // Set token in state
    setRole(userData.role); // Set role in state
    setUserId(userData.userId);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('userId')
    setUser(null);
    setRole(null);
    setUserId(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
