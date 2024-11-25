const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
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

describe('Auth Controller', () => {
  it('should register a new user with client role by default', async () => {
    const res = await request(app).post('/auth/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      phoneNumber: '12345678',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
    expect(res.body.user).toHaveProperty('username', 'testuser');
    expect(res.body.user).toHaveProperty('role', 'client');
  });

  it('should register a new user with admin role', async () => {
    const res = await request(app).post('/auth/register').send({
      username: 'adminuser',
      email: 'admin@example.com',
      password: 'adminpassword',
      phoneNumber: '87654321',
      role: 'admin',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
    expect(res.body.user).toHaveProperty('username', 'adminuser');
    expect(res.body.user).toHaveProperty('role', 'admin');
  });

  it('should login an existing user and return a valid token', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'client',
    });
    await user.save();

    const res = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded).toHaveProperty('id', user._id.toString());
    expect(decoded).toHaveProperty('role', 'client');
  });

  it('should not login with incorrect password', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'client',
    });
    await user.save();

    const res = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid password');
  });

  it('should not login with non-existent email', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('User not found');
  });

  it('should authorize a valid token and return user details', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'client',
    });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app).get('/auth/authorize').set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('valid', true);
    expect(res.body).toHaveProperty('id', user._id.toString());
    expect(res.body).toHaveProperty('role', 'client');
  });

  it('should not authorize an invalid token', async () => {
    const res = await request(app).get('/auth/authorize').set('Authorization', 'invalidtoken');

    expect(res.statusCode).toBe(401);
    expect(res.body.valid).toBe(false);
    expect(res.body.error).toBe('Invalid token');
  });

  it('should not authorize without a token', async () => {
    const res = await request(app).get('/auth/authorize');

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Access denied');
  });
});
