const request = require('supertest');
const app = require('../index'); // Import the API Gateway app
const nock = require('nock');

describe('Search Gateway', () => {
  const SEARCH_SERVICE_URL = process.env.SEARCH_SERVICE_URL || 'http://localhost:3003';

  afterEach(() => {
    nock.cleanAll();
  });

  it('should proxy GET /search/short-listings to Search Service', async () => {
    nock(SEARCH_SERVICE_URL)
      .get('/search/short-listings')
      .reply(200, [{ id: '1', title: 'Short Listing 1' }]);

    const res = await request(app)
      .get('/search/short-listings')
      .set('Authorization', 'Bearer fake-token');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: '1', title: 'Short Listing 1' }]);
  });

  it('should handle 404 errors from Search Service', async () => {
    nock(SEARCH_SERVICE_URL)
      .get('/search/unknown-endpoint')
      .reply(404, { error: 'Not Found' });

    const res = await request(app)
      .get('/search/unknown-endpoint')
      .set('Authorization', 'Bearer fake-token');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Not Found');
  });
});
