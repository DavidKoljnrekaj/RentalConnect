const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index'); 
const Listing = require('../models/listing');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await Listing.deleteMany(); // Clear the database after each test
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Search Service - getShortListings', () => {
  const sampleListings = [
    {
      title: 'Spacious Apartment in Downtown',
      description: 'A modern apartment with great views.',
      price: { monthlyRent: 1200, deposit: 2400 },
      images: ['https://example.com/image1.jpg'],
      location: { address: '123 Main St', city: 'New York' },
      propertyDetails: { type: 'apartment', size: 85, bedrooms: 2, bathrooms: 2, furnished: true },
      utilities: { included: true, fixed: true, amount: 150, details: 'water, electricity, internet, pool' },
      contact: { name: 'John Doe', phone: '123-456-7890', email: 'john.doe@example.com' },
      availability: { availableFrom: '2024-01-01', leaseDuration: '1 year' },
      createdBy: new mongoose.Types.ObjectId(),
    },
    {
      title: 'Cozy Studio in Suburbs',
      description: 'A compact and cozy studio.',
      price: { monthlyRent: 800, deposit: 1600 },
      images: ['https://example.com/image2.jpg'],
      location: { address: '456 Elm St', city: 'Los Angeles' },
      propertyDetails: { type: 'studio', size: 45, bedrooms: 1, bathrooms: 1, furnished: false },
      utilities: { included: true, fixed: false, details: 'water, electricity, internet, pool' },
      contact: { name: 'Jane Smith', phone: '987-654-3210', email: 'jane.smith@example.com' },
      availability: { availableFrom: '2024-02-01', leaseDuration: '6 months' },
      createdBy: new mongoose.Types.ObjectId(),
    },
    {
      title: 'Luxury House in Beverly Hills',
      description: 'A luxurious house with premium amenities.',
      price: { monthlyRent: 5000, deposit: 10000 },
      images: ['https://example.com/image3.jpg'],
      location: { address: '789 Beverly Dr', city: 'Los Angeles' },
      propertyDetails: { type: 'house', size: 300, bedrooms: 4, bathrooms: 3, furnished: true },
      utilities: { included: true, fixed: true, amount: 500, details: 'water, electricity, internet, pool' },
      contact: { name: 'Luxury Agent', phone: '555-555-5555', email: 'agent@luxuryhomes.com' },
      availability: { availableFrom: '2024-03-01', leaseDuration: '1 year' },
      createdBy: new mongoose.Types.ObjectId(),
    },
  ];
  

  it('should return paginated short listings', async () => {
    await Listing.insertMany(sampleListings);

    const res = await request(app).get('/search/short-listings?page=1&limit=2');

    expect(res.statusCode).toBe(200);
    expect(res.body.listings.length).toBe(2); // Should return 2 listings as per limit
    expect(res.body.total).toBe(3); // Total listings in the database
    expect(res.body.currentPage).toBe(1);
    expect(res.body.totalPages).toBe(2); // Total pages (3 listings / 2 per page = 2 pages)
    expect(res.body.listings[0]).toHaveProperty('title');
    expect(res.body.listings[0]).toHaveProperty('price');
    expect(res.body.listings[0]).toHaveProperty('images');
    expect(res.body.listings[0]).toHaveProperty('location');
  });

  it('should filter listings by city', async () => {
    await Listing.insertMany(sampleListings);

    const res = await request(app).get('/search/short-listings?city=Los Angeles');

    expect(res.statusCode).toBe(200);
    expect(res.body.listings.length).toBe(2); // Only 2 listings are in Los Angeles
    expect(res.body.total).toBe(2);
    expect(res.body.listings[0].location.city).toBe('Los Angeles');
  });

  it('should filter listings by property type', async () => {
    await Listing.insertMany(sampleListings);

    const res = await request(app).get('/search/short-listings?type=apartment');

    expect(res.statusCode).toBe(200);
    expect(res.body.listings.length).toBe(1); // Only 1 apartment in the dataset
    expect(res.body.total).toBe(1);
    expect(res.body.listings[0].propertyDetails.type).toBe('apartment');
  });

  it('should filter listings by price range', async () => {
    await Listing.insertMany(sampleListings);

    const res = await request(app).get('/search/short-listings?minPrice=1000&maxPrice=2000');

    expect(res.statusCode).toBe(200);
    expect(res.body.listings.length).toBe(1); // Only 1 listing matches the price range
    expect(res.body.total).toBe(1);
    expect(res.body.listings[0].price.monthlyRent).toBe(1200);
  });

  it('should return an empty array if no listings match the filter', async () => {
    await Listing.insertMany(sampleListings);

    const res = await request(app).get('/search/short-listings?city=NonexistentCity');

    expect(res.statusCode).toBe(200);
    expect(res.body.listings.length).toBe(0);
    expect(res.body.total).toBe(0);
  });

  it('should default to page 1 and limit 10 if no pagination parameters are provided', async () => {
    await Listing.insertMany(sampleListings);

    const res = await request(app).get('/search/short-listings');

    expect(res.statusCode).toBe(200);
    expect(res.body.listings.length).toBe(3); // All listings should be returned since limit is more than total
    expect(res.body.currentPage).toBe(1);
    expect(res.body.totalPages).toBe(1);
  });
});
