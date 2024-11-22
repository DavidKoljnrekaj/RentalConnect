const Listing = require('../models/listingModel');

exports.createListing = async (data, userId) => {
  const listing = new Listing({ ...data, userId });
  await listing.save();
  return listing;
};

exports.getListingById = async (id) => {
  const listing = await Listing.findById(id).populate('userId', 'username email'); // Populate user details
  if (!listing) throw new Error('Listing not found');
  return listing;
};

exports.getAllListings = async () => {
  return await Listing.find().populate('userId', 'username email'); // Populate user details
};

exports.updateListing = async (id, data, userId) => {
  const listing = await Listing.findOneAndUpdate({ _id: id, userId }, data, { new: true });
  if (!listing) throw new Error('Listing not found or unauthorized');
  return listing;
};

exports.deleteListing = async (id, userId) => {
  const listing = await Listing.findOneAndDelete({ _id: id, userId });
  if (!listing) throw new Error('Listing not found or unauthorized');
  return listing;
};
