const userService = require('../services/userService');

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    res.json(user);
  } catch (error)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
   {
    res.status(404).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const favorites = await userService.addFavorite(req.body.listingId, req.body.userId)
    res.status(200).json(favorites);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const favorites = await userService.removeFavorite(req.body.listingId, req.body.userId)
    res.status(200).json(favorites);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.params.id;
    const favorites = await userService.getFavorites(userId)
    res.status(200).json(favorites);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

