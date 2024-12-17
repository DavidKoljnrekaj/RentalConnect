const Listing = require('../models/listing');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Path to your service account key file
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);



// Initialize Google Cloud Storage with explicit credentials
const storage = new Storage({
  credentials: credentials
});

const bucketName = 'rentalconnect-bucket';

exports.createListing = async (data, files, userId) => {
  const uploadedImages = [];

  // Upload images to Google Cloud Storage
  if (files && files.length > 0) {
    for (const file of files) {
      const blob = storage.bucket(bucketName).file(`property-images/${Date.now()}-${file.originalname}`);
      await blob.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });
      uploadedImages.push(`https://storage.googleapis.com/${bucketName}/${blob.name}`);
    }
  }

  // Merge uploaded image URLs with listing data
  const listingData = {
    ...data,
    images: uploadedImages,
    createdBy: userId,
  };

  const listing = new Listing(listingData);
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
