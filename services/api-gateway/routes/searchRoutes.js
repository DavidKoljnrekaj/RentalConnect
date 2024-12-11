const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const route = process.env.SEARCH_SERVICE_URL || 'http://localhost:3003'

// Allow clients and admins to access search
router.use(
  '/',
  createProxyMiddleware({
    target: route,
    changeOrigin: true,
    pathRewrite: { '^/': '/search/' },
  })
);

module.exports = router;
