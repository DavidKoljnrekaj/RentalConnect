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
    approvalStatus: 'pending', // Explicitly set to pending
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

exports.updateListing = async (id, data, files, userId) => {
  // Fetch the existing listing
  const listing = await Listing.findById(id);
  if (!listing) throw new Error('Listing not found');
  if (listing.createdBy.toString() !== userId.toString()) throw new Error('Unauthorized');

  const uploadedImages = [];
  const removedImages = [];

  // Upload new images to Google Cloud Storage
  if (files && files.length > 0) {
    for (const file of files) {
      const blob = storage.bucket(bucketName).file(`property-images/${Date.now()}-${file.originalname}`);
      await blob.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });
      uploadedImages.push(`https://storage.googleapis.com/${bucketName}/${blob.name}`);
    }
  }

  // Determine which existing images have been removed
  if (data.existingImages) {
    const existingImages = Array.isArray(data.existingImages) ? data.existingImages : [data.existingImages];
    removedImages.push(...listing.images.filter((img) => !existingImages.includes(img)));

    // Keep only the remaining existing images
    data.images = [...existingImages, ...uploadedImages];
  } else {
    // If no existing images provided, consider all current images removed
    removedImages.push(...listing.images);
    data.images = uploadedImages; // Only new images remain
  }

  // Update the listing with the new data and merged images
  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    { ...data },
    { new: true }
  );

  if (!updatedListing) throw new Error('Error updating listing');

  // Optionally, delete removed images from Google Cloud Storage
  for (const imageUrl of removedImages) {
    const fileName = imageUrl.split('/').pop();
    await storage.bucket(bucketName).file(`property-images/${fileName}`).delete().catch((error) => {
      console.error(`Error deleting image ${fileName}:`, error);
    });
  }

  return {
    updatedListing,
    uploadedImages,
    removedImages,
  };
};


exports.deleteListing = async (id) => {
  const listing = await Listing.findOneAndDelete({ _id: id});
  if (!listing) throw new Error('Listing not found or unauthorized');
  return listing;
};

exports.approveListing = async (id) => {
  const listing = await Listing.findByIdAndUpdate(id, { approvalStatus: 'approved' }, { new: true });
  if (!listing) throw new Error('Listing not found');
  return listing;
};

exports.rejectListing = async (id) => {
  const listing = await Listing.findByIdAndUpdate(id, { approvalStatus: 'rejected' }, { new: true });
  if (!listing) throw new Error('Listing not found');
  return listing;
};

