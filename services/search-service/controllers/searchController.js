const searchService = require('../services/searchService');

exports.getShortListings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {
      city: req.query.city,
      type: req.query.type,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
    };

    const { listings, total } = await searchService.getShortListings(filters, page, limit);

    res.json({
      listings,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMyListings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;

    const userId = req.headers['x-user-id'];

    const { listings, total } = await searchService.getMyListings(userId, page, limit);

    res.json({
      listings,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPendingShortListings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { listings, total } = await searchService.getPendingShortListings(page, limit);

    res.json({
      listings,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



exports.getMapListings = async (req, res) => {
  try {
    const listings = await searchService.getMapListings();
    res.json(listings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getShortListingsByIds = async (req, res) => {
  try {
    const listingIds = req.body.listingIds;
    const listings = await searchService.getShortListingsByIds(listingIds);
    res.status(200).json(listings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getRelatedListings = async (req, res) => {
  try {
    const listingId = req.params.id;

    const relatedListings = await searchService.getRelatedListings(listingId);
    res.status(200).json(relatedListings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};