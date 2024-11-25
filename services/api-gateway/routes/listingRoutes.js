const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Admin-only route to delete listings  (example role limited endpoint)
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
    target: process.env.LISTING_SERVICE_URL,
    changeOrigin: true,
  })
);

module.exports = router;
