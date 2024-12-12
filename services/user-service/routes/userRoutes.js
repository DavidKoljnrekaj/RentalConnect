const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/:id', userController.getUser); // Get a specific user
router.get('/', userController.getUsers);  // Get all users
router.post('/favorites', userController.addFavorite);  // Add favourite
router.delete('/favorites', userController.removeFavorite);  // Remove favourite
router.get('/:id/favorites', userController.getFavorites);  // Get favourites

module.exports = router;
