const Listing = require('../models/listing'); 

// Get short listings with pagination and optional filters
exports.getShortListings = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const query = {};

  //add filters laterrr
  if (filters.city) query['location.city'] = filters.city;
  if (filters.type) query['propertyDetails.type'] = filters.type;
  if (filters.minPrice) query['price.monthlyRent'] = { $gte: filters.minPrice };
  if (filters.maxPrice) {
    query['price.monthlyRent'] = {
      ...query['price.monthlyRent'],
      $lte: filters.maxPrice,
    };
  }

  const listings = await Listing.find(query, 'title price.monthlyRent images location.city propertyDetails.type')
    .skip(skip)
    .limit(limit);

  const total = await Listing.countDocuments(query);

  return { listings, total };
};
