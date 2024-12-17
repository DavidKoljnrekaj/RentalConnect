const listingService = require('../services/listingService');

exports.createListing = async (req, res) => {
  try {
    console.log(req.headers['x-user-id'])
    const userId = req.headers['x-user-id']; // Get userId from token or body
    const files = req.files || []; // Multer will attach files here
    const listing = await listingService.createListing(req.body, files, userId);
    res.status(201).json(listing);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await listingService.getListingById(req.params.id);
    res.json(listing);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.getAllListings = async (req, res) => {
  try {
    const listings = await listingService.getAllListings();
    res.json(listings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await listingService.updateListing(req.params.id, req.body);
    res.json(listing);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await listingService.deleteListing(req.params.id);
    res.json({ message: 'Listing deleted successfully', listing });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
