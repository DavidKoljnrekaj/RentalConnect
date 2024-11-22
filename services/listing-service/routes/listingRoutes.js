const express = require('express');
const listingController = require('../controllers/listingController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify JWT

const router = express.Router();

router.post('/', authMiddleware, listingController.createListing); // Protected route
router.get('/:id', listingController.getListingById); // Public route
router.get('/', listingController.getAllListings); // Public route
router.put('/:id', authMiddleware, listingController.updateListing); // Protected route
router.delete('/:id', authMiddleware, listingController.deleteListing); // Protected route

module.exports = router;
