import React, { useState } from 'react';
import './Auth.css';
import authService from '../../services/authService';

const Register = ({ onClose, onSwitch }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      const { username, email, password } = formData; // Exclude unnecessary fields
      const response = await authService.register({ username, email, password });
      console.log('Registration successful:', response.data);
      onClose(); // Close the modal after successful registration
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="overlay">
      <div className="auth-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Create an Account!</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Repeat Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="register-button">
            Register Account
          </button>
        </form>
        <p>
          Already have an account?{' '}
          <button onClick={onSwitch} className="switch-button">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
