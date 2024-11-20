const User = require('../models/userModel');
const authService = require('../services/authService');

exports.signup = async (req, res) => {
  try {
    const { username, email, password, phoneNumber } = req.body;
    const newUser = await authService.createUser(username, email, password, phoneNumber);
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.authenticateUser(email, password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const token = req.header('Authorization');
    const decoded = authService.verifyToken(token);
    res.json({ userId: decoded.id });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
