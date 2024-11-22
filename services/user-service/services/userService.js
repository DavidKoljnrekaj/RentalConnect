const User = require('../models/userModel');

exports.getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password'); // Exclude the password field
    return user;
};

exports.getAllUsers = async () => {
  return await User.find().select('-password');
};
