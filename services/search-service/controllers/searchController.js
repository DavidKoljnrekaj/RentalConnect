const searchService = require('../services/searchService');

exports.getShortListings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Extract filters from query parameters
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
