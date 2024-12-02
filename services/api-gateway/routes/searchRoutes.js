const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const route = process.env.USER_SERVICE_URL || 'http://localhost:3003'

// Allow clients and admins to access search
router.use(
  '/',
  authMiddleware,
  createProxyMiddleware({
    target: route,
    changeOrigin: true,
  })
);

module.exports = router;
