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

exports.getRelatedListings = async (listingId) => {
  try {
    const listing = await Listing.findById(listingId, {
      'price.monthlyRent': 1,
      'location.coordinates': 1,
      'propertyDetails.type': 1,
    });

    if (!listing || !listing.location.coordinates.lat || !listing.location.coordinates.lng) {
      throw new Error('Listing not found or missing coordinates');
    }

    const { lat, lng } = listing.location.coordinates;
    const type = listing.propertyDetails.type;
    const price = listing.price.monthlyRent;

    const minPrice = price * 0.8; // 20% below the listing price
    const maxPrice = price * 1.2; // 20% above the listing price

    const nearbyListings = await Listing.find({
      _id: { $ne: listingId }, // Exclude the current listing
      'price.monthlyRent': { $gte: minPrice, $lte: maxPrice },
      'propertyDetails.type': type,
      'location.coordinates.lat': { $ne: null },
      'location.coordinates.lng': { $ne: null },
    })
      .limit(4)
      .select('title price.monthlyRent location.coordinates images') // Return only necessary fields
      .lean(); // Return plain objects

    return nearbyListings;
  } catch (error) {
    console.error('Error fetching related listings:', error);
    throw error;
  }
};
