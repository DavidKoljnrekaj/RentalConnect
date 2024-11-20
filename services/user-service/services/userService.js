const User = require('../models/userModel');

exports.getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

exports.getAllUsers = async () => {
  return await User.find().select('-password');
};
