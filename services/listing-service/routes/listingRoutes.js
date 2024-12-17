const express = require('express');
const multer = require('multer');
const listingController = require('../controllers/listingController');
const router = express.Router();

// Multer configuration for file uploads (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.array('images'), listingController.createListing); // Handle images
router.get('/:id', listingController.getListingById); // Public route
router.get('/', listingController.getAllListings); // Public route
router.put('/:id', listingController.updateListing); // Protected route
router.delete('/:id', listingController.deleteListing); // Protected route

module.exports = router;
