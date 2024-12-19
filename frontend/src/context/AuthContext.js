import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // Load authentication state from sessionStorage when the app loads
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedRole = sessionStorage.getItem('role');
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUser && storedRole) {
      setUser(storedUser);
      setRole(storedRole);
      setUserId(storedUserId)
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData) => {
    sessionStorage.setItem('user', userData.token); // Store token directly
    sessionStorage.setItem('role', userData.role); // Store role directly
    sessionStorage.setItem('userId', userData.userId); // Store role directly
    console.log('context user', userData.token);
    console.log('context role', userData.role);
    setUser(userData.token); // Set token in state
    setRole(userData.role); // Set role in state
    setUserId(userData.userId);
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('userId')
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
