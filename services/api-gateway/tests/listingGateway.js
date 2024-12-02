const request = require('supertest');
const app = require('../index'); // Import the API Gateway app
const nock = require('nock');


describe('Listings Gateway', () => {
  const LISTING_SERVICE_URL = process.env.LISTING_SERVICE_URL || 'http://localhost:3002';

  afterEach(() => {
    nock.cleanAll();
  });

  it('should proxy GET /listings to Listing Service', async () => {
    nock(LISTING_SERVICE_URL)
      .get('/listings')
      .reply(200, [{ id: '1', title: 'Test Listing' }]);

    const res = await request(app)
      .get('/listings')
      .set('Authorization', 'Bearer fake-token');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: '1', title: 'Test Listing' }]);
  });

  it('should proxy DELETE /listings/:id to Listing Service with admin role', async () => {
    const listingId = '12345';
    nock(LISTING_SERVICE_URL)
      .delete(`/listings/${listingId}`)
      .reply(204);

    const res = await request(app)
      .delete(`/listings/${listingId}`)
      .set('Authorization', 'Bearer fake-admin-token'); // Assume token contains admin role

    expect(res.statusCode).toBe(204);
  });

  it('should return 403 for DELETE /listings/:id without admin role', async () => {
    const res = await request(app)
      .delete('/listings/12345')
      .set('Authorization', 'Bearer fake-client-token'); // Assume token contains client role

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('error', 'Access forbidden: admins only');
  });
});
