const express = require('express');
const { createProxyMiddleware , fixRequestBody } = require('http-proxy-middleware');
const authMiddleware = require('../middleware/authMiddleware');
const UserService = require('../services/UserService');
const ListingService = require('../services/ListingService'); 

const router = express.Router(); 

const route = process.env.LISTING_SERVICE_URL || 'http://localhost:3002'

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access forbidden: Admins only' });
  }
  next();
};



router.post('/', authMiddleware, (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'User ID not found in token' });
  }
  req.headers['x-user-id'] = req.user.id; // Attach user ID to headers
  req.body = { ...req.body, createdBy: req.user.id };
  console.log(req.user.id)
  console.log(req.body)
  next();
});

// Fetch favorited listings
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const favorites = await UserService.getFavorites(req.user.id);
    const listings = await ListingService.getShortListings(favorites);
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only route to delete listings  
router.delete('/:id', authMiddleware, adminOnly, (req, res, next) => {
  next();
});

// Admin-only route to delete listings  
router.patch('/:id/approve', authMiddleware, adminOnly, (req, res, next) => {
  next();
});

// Admin-only route to delete listings  
router.patch('/:id/reject', authMiddleware, adminOnly, (req, res, next) => {
  next();
});

// Proxy all requests to Listing Service
router.use(
  '/',
  createProxyMiddleware({
    target: route,
    changeOrigin: true,
    pathRewrite: { '^/': '/listings/' },
    on: {
      proxyRes: (proxyRes, req, res) => {
        // Ensure CORS headers are included in the response
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
      },
      proxyReq: fixRequestBody,
    },  
  })
);

module.exports = router;
