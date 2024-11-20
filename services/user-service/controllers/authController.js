const User = require('../models/userModel');
const authService = require('../services/authService');

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await authService.createUser(username, email, password);
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
