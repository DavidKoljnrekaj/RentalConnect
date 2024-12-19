const Listing = require('../models/listing'); 

// Get short listings with pagination and optional filters (only approved)
exports.getShortListings = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const query = { approvalStatus: 'approved' }; // Filter only approved listings

  if (filters.city) query['location.city'] = filters.city;
  if (filters.type) query['propertyDetails.type'] = filters.type;
  if (filters.minPrice) query['price.monthlyRent'] = { $gte: filters.minPrice };
  if (filters.maxPrice) {
    query['price.monthlyRent'] = {
      ...query['price.monthlyRent'],
      $lte: filters.maxPrice,
    };
  }

  const listings = await Listing.find(query, {
    title: 1,
    'price.monthlyRent': 1,
    images: { $slice: 1 }, // Return only the first image
    'location.city': 1,
    'propertyDetails.type': 1,
  })
    .skip(skip)
    .limit(limit);

  const total = await Listing.countDocuments(query);

  return { listings, total };
};

// Get listings created by a specific user
exports.getMyListings = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const listings = await Listing.find(
    { createdBy: userId },
    {
      title: 1,
      approvalStatus: 1, 
      'price.monthlyRent': 1,
      images: { $slice: 1 },
      'location.city': 1,
      'propertyDetails.type': 1,
    }
  )
    .skip(skip)
    .limit(limit);

  const total = await Listing.countDocuments({ createdBy: userId });

  return { listings, total };
};

// Get pending listings for admin approval
exports.getPendingShortListings = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const listings = await Listing.find(
    { approvalStatus: 'pending' },
    {
      title: 1,
      'price.monthlyRent': 1,
      images: { $slice: 1 },
      'location.city': 1,
      'propertyDetails.type': 1,
    }
  )
    .skip(skip)
    .limit(limit);

  const total = await Listing.countDocuments({ approvalStatus: 'pending' });

  return { listings, total };
};

exports.getMapListings = async () => {
  try {
    const listings = await Listing.find({
      "location.coordinates.lat": { $ne: null },
      "location.coordinates.lng": { $ne: null }
    }, 'title price.monthlyRent location.coordinates');
    return listings.map((listing) => ({
      id: listing._id,
      title: listing.title,
      price: listing.price.monthlyRent,
      lat: listing.location.coordinates.lat,
      lng: listing.location.coordinates.lng,
    }));
  } catch (error) {
    console.error('Error fetching map listings:', error);
    throw new Error('Failed to fetch map listings');
  }
};

exports.getShortListingsByIds = async (listingIds) => {
    const listings = await Listing.find(
      { _id: { $in: listingIds } },
      { title: 1, price: 1, images: { $slice: 1 } } // Return only necessary fields
    );
    return listings
};