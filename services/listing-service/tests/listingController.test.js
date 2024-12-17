const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index'); // Ensure this points to your app's main file
const Listing = require('../models/listing');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await Listing.deleteMany(); // Clear listings after each test
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Listing Service', () => {
  const sampleListing = {
    title: 'Spacious Apartment in Downtown',
    description: 'A modern apartment with a great view.',
    price: {
      monthlyRent: 1200,
      deposit: 2400,
    },
    location: {
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      coordinates: { lat: 40.7128, lng: -74.0060 },
    },
    propertyDetails: {
      type: 'apartment',
      size: 85,
      bedrooms: 2,
      bathrooms: 2,
      furnished: true,
      petsAllowed: true,
    },
    utilities: {
      included: true,
      fixed: true,
      amount: 150,
      details: 'water, electricity, internet]',
    },
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    contact: {
      name: 'John Doe',
      phone: '123-456-7890',
      email: 'john.doe@example.com',
    },
    availability: {
      availableFrom: '2024-01-01',
      leaseDuration: '1 year',
    },
    createdBy: new mongoose.Types.ObjectId(),
  };

  it('should create a new listing', async () => {
    const validObjectId = new mongoose.Types.ObjectId();
    const res = await request(app).post('/listings').set('x-user-id', validObjectId.toString()).send(sampleListing);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(sampleListing.title);
    expect(res.body.price.monthlyRent).toBe(sampleListing.price.monthlyRent);
    expect(res.body.createdBy).toBeDefined(); // Ensure createdBy is populated
  });

  it('should retrieve all listings', async () => {
    await Listing.create(sampleListing);
    const res = await request(app).get('/listings');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe(sampleListing.title);
  });

  it('should retrieve a listing by ID', async () => {
    const listing = await Listing.create(sampleListing);
    const res = await request(app).get(`/listings/${listing._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(sampleListing.title);
    expect(res.body.price.monthlyRent).toBe(sampleListing.price.monthlyRent);
  });

  it('should update a listing by ID', async () => {
    const listing = await Listing.create(sampleListing);
    const updatedData = { title: 'Updated Title' };

    const res = await request(app).put(`/listings/${listing._id}`).send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(updatedData.title);
  });

  it('should delete a listing by ID', async () => {
    const listing = await Listing.create(sampleListing);

    const res = await request(app).delete(`/listings/${listing._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Listing deleted successfully');

    const deletedListing = await Listing.findById(listing._id);
    expect(deletedListing).toBeNull();
  });

  it('should return 404 for a non-existent listing', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const res = await request(app).get(`/listings/${nonExistentId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Listing not found');
  });
});
