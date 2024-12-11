import React, { useState } from 'react';
import './Auth.css';
import authService from '../../services/authService';

const Login = ({ onClose, onSwitch }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(formData);
      console.log('Login successful:', response.data);
      onClose(); // Close the modal after successful login
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="overlay">
      <div className="auth-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p>
          Don’t have an account?{' '}
          <button onClick={onSwitch} className="switch-button">
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;