const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the listing
  description: { type: String, required: true }, // Description of the property
  price: { 
    monthlyRent: { type: Number, required: true }, // Monthly rent amount
    deposit: { type: Number, required: true }, // Security deposit amount
  },
  location: { 
    address: { type: String, required: true }, // Full address
    city: { type: String, required: true }, // City
    state: { type: String, required: false }, // State/Province (optional, depending on country)
    postalCode: { type: String, required: false }, // Postal code (optional)
    coordinates: { 
      lat: { type: Number, required: false }, // Latitude
      lng: { type: Number, required: false }, // Longitude
    },
  },
  propertyDetails: {
    type: { type: String, enum: ['apartment', 'house', 'studio'], required: true }, // Property type
    size: { type: Number, required: true }, // Size in square meters
    bedrooms: { type: Number, required: true }, // Number of bedrooms
    bathrooms: { type: Number, required: true }, // Number of bathrooms
    furnished: { type: Boolean, required: true }, // Is it furnished?
    petsAllowed: { type: Boolean, default: false }, // Are pets allowed?
  },
  utilities: {
    included: { type: Boolean, required: true }, // Are utilities included in rent?
    details: { type: String, required: false }, // List of included utilities, price etc.
  },
  images: { type: [String], required: false }, // Array of image URLs
  contact: {
    name: { type: String, required: true }, // Contact person's name
    phone: { type: String, required: true }, // Contact person's phone
    email: { type: String, required: true }, // Contact person's email
  },
  availability: {
    availableFrom: { type: Date, required: true }, // Date when the property is available
    leaseDuration: { type: String, required: true }, // Lease duration (e.g., '6 months', '1 year')
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  createdAt: { type: Date, default: Date.now }, // Creation date
});

module.exports = mongoose.model('Listing', listingSchema);
