const listingService = require('../services/listingService');

exports.createListing = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.createdBy; // Extract userId from the token (middleware should set `req.user`)
    const listing = await listingService.createListing(req.body, userId);
    res.status(201).json(listing);
  } catch (error) {
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
    const userId = req.user.id; // Extract userId from the token
    const listing = await listingService.updateListing(req.params.id, req.body, userId);
    res.json(listing);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const userId = req.user.id; // Extract userId from the token
    const listing = await listingService.deleteListing(req.params.id, userId);
    res.json({ message: 'Listing deleted successfully', listing });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
