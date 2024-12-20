import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const syncAuthState = () => {
    const storedUser = sessionStorage.getItem('user');
    const storedRole = sessionStorage.getItem('role');
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUser && storedRole) {
      setUser(storedUser);
      setRole(storedRole);
      setUserId(storedUserId);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setRole(null);
      setUserId(null);
      setIsAuthenticated(false);
    }
  };

  // Load authentication state from sessionStorage on app load
  useEffect(() => {
    syncAuthState();

    // Listen for changes to sessionStorage
    const handleStorageChange = () => {
      syncAuthState();
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (userData) => {
    sessionStorage.setItem('user', userData.token); // Store token directly
    sessionStorage.setItem('role', userData.role); // Store role directly
    sessionStorage.setItem('userId', userData.userId); // Store role directly
    syncAuthState();
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('userId');
    syncAuthState();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
