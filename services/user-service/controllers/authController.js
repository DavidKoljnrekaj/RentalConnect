const User = require('../models/userModel');
const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, role } = req.body;
    const newUser = await authService.createUser(username, email, password, phoneNumber, role);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => { 
  try {
    const { email, password } = req.body;
    const { token, role, userId } = await authService.authenticateUser(email, password); // Destructure token and role
    res.json({ token, role, userId }); // Directly return token and role
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.authorize = async (req, res) => {
  const token = req.header('Authorization');;
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const userData = await authService.verifyToken(token.replace(/^Bearer\s*/, ""));
    res.json({ valid: true, ...userData });
  } catch (error) {
    res.status(401).json({ valid: false, error: error.message });
  }
};
