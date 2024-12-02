const request = require('supertest');
const axios = require('axios');
const app = require('../index'); // Import the API Gateway app
const nock = require('nock');
nock.recorder.rec();
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

nock.disableNetConnect();
nock.enableNetConnect('127.0.0.1');

nock('http://localhost:3001')
  .persist()
  .post('/auth/login', { email: 'test@example.com', password: 'password123' })
  .reply(200, { token: 'fake-jwt-token' });

  
  describe('API Gateway - User Service Proxying', () => {
    it('should proxy /users/auth/login to User Service', async () => {
      // Make the request through the API Gateway
      const res = await request(app)
        .post('/users/auth/login') // Gateway path
        .send({ email: 'test@example.com', password: 'password123' }); // Mocked payload
  
      // Assert the response
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token', 'fake-jwt-token');
    });
  });