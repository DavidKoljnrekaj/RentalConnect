const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

// Route to fetch short listings with pagination and filters
router.get('/short-listings', searchController.getShortListings);

// Route to fetch user's own listings
router.get('/my-listings', searchController.getMyListings);

// Route to fetch pending short listings for admin approval
router.get('/pending-short-listings', searchController.getPendingShortListings);

router.get('/map-listings', searchController.getMapListings);
router.post('/short-listings', searchController.getShortListingsByIds)

module.exports = router;
