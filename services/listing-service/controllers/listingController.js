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
    // Extract user ID from headers or authentication middleware
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'User ID is required for this action.' });
    }

    // Extract files uploaded via Multer
    const files = req.files || [];

    // Call the service to update the listing
    const result = await listingService.updateListing(req.params.id, req.body, files, userId);

    // Send the result back to the client
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in updateListing controller:', error.message);

    // Handle specific errors with appropriate status codes
    if (error.message === 'Listing not found' || error.message === 'Unauthorized') {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: 'An unexpected error occurred.' });
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


exports.approveListing = async (req, res) => {
  try {
    const listing = await listingService.approveListing(req.params.id);
    res.json({ message: 'Listing approved successfully', listing });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.rejectListing = async (req, res) => {
  try {
    const listing = await listingService.rejectListing(req.params.id);
    res.json({ message: 'Listing rejected successfully', listing });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
  