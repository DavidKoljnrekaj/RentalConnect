const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index'); // Import the app
const User = require('../models/userModel');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe('Auth Controller', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/auth/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      phoneNumber: '12345678'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
    expect(res.body.user).toHaveProperty('username', 'testuser');
  });

  it('should login an existing user', async () => {
    // Create a user directly in the database
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
    });
    await user.save();

    const res = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with incorrect password', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
    });
    await user.save();

    const res = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid password');
  });

  it('should verify a valid token', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
    });
    await user.save();

    const loginRes = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    const token = loginRes.body.token;

    const verifyRes = await request(app)
      .get('/auth/verify')
      .set('Authorization', token);

    expect(verifyRes.statusCode).toBe(200);
    expect(verifyRes.body).toHaveProperty('userId');
  });
});
