const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index'); // Import the app
const User = require('../models/userModel');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe('User Controller', () => {
  it('should get a user by ID', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    await user.save();

    const res = await request(app).get(`/users/${user._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username', 'testuser');
  });

  it('should get all users', async () => {
    const users = [
      { username: 'user1', email: 'user1@example.com', password: 'password123' },
      { username: 'user2', email: 'user2@example.com', password: 'password123' },
    ];
    await User.insertMany(users);

    const res = await request(app).get('/users');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('username', 'user1');
    expect(res.body[1]).toHaveProperty('username', 'user2');
  });

  it('should return 404 if user is not found', async () => {
    const res = await request(app).get('/users/invalid-id');

    expect(res.statusCode).toBe(404);
  });
});
