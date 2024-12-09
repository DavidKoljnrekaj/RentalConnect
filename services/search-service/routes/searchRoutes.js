const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

// Route to fetch short listings with pagination and filters
router.get('/short-listings', searchController.getShortListings);

module.exports = router;
