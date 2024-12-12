const User = require('../models/userModel');

exports.getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password'); // Exclude the password field
    return user;
};

exports.getAllUsers = async () => {
  return await User.find().select('-password');
};

exports.addFavorite = async (listingId, userId) => {
  const user = await User.findById(userId);
    if (!user.favorites.includes(listingId)) {
      user.favorites.push(listingId);
      await user.save();
    }
    return user.favorites
};

exports.removeFavorite = async (Id, userId) => {
    const user = await User.findById(userId);
    user.favorites = user.favorites.filter(
      (listingId) => listingId !== Id
    );
    return user.favorites
};

exports.getFavorites = async (userId) => {
    const user = await User.findById(userId);
    return user.favorites
};
