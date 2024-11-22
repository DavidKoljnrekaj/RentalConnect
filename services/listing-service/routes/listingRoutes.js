const express = require('express');
const listingController = require('../controllers/listingController');
const router = express.Router();

router.post('/', listingController.createListing); // Protected route
router.get('/:id', listingController.getListingById); // Public route
router.get('/', listingController.getAllListings); // Public route
router.put('/:id', listingController.updateListing); // Protected route
router.delete('/:id', listingController.deleteListing); // Protected route

module.exports = router;
