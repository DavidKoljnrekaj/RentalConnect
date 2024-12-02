const axios = require('axios');
const nock = require('nock');

nock('http://localhost:3001')
  .post('/auth/login', { email: 'test@example.com', password: 'password123' })
  .reply(200, { token: 'fake-jwt-token' });

test('nock mock should respond correctly', async () => {
  const response = await axios.post('http://localhost:3001/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  });

  expect(response.status).toBe(200);
  expect(response.data).toHaveProperty('token', 'fake-jwt-token');
});
