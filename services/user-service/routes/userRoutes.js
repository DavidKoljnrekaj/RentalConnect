const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/:id', userController.getUser); // Get a specific user
router.get('/', userController.getUsers);  // Get all users

module.exports = router;
