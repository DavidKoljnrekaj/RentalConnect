const express = require('express');
const { createProxyMiddleware , fixRequestBody } = require('http-proxy-middleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const route = process.env.LISTING_SERVICE_URL || 'http://localhost:3002'

router.post('/', authMiddleware, (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'User ID not found in token' });
  }
  console.log(req.body) //RETURNS UNDEFINED
  req.body = { ...req.body, createdBy: req.user.id };
  next();
});


// Admin-only route to delete listings  
router.delete('/:id', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access forbidden: Admins only' });
  }
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
      proxyReq: fixRequestBody,
    },  
  })
);

module.exports = router;
