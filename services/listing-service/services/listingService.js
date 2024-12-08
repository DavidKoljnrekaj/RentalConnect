const Listing = require('../models/listing');

exports.createListing = async (data, userId) => {
  const listing = new Listing({ ...data, userId });
  await listing.save();
  return listing;
};

exports.getListingById = async (id) => {
  const listing = await Listing.findById(id);
  if (!listing) throw new Error('Listing not found');
  return listing;
};

exports.getAllListings = async () => {
  return await Listing.find();
};

exports.updateListing = async (id, data) => {
  const listing = await Listing.findOneAndUpdate( { _id: id } , data, { new: true });
  if (!listing) throw new Error('Listing not found or unauthorized');
  return listing;
};

exports.deleteListing = async (id) => {
  const listing = await Listing.findOneAndDelete({ _id: id});
  if (!listing) throw new Error('Listing not found or unauthorized');
  return listing;
};
