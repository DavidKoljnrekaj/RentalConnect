const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const route = process.env.USER_SERVICE_URL || 'http://localhost:3001'

// Proxy /auth routes under /users/auth
router.use(
    '/auth',
    createProxyMiddleware({
      target: route,
      changeOrigin: true,
      pathRewrite: { '^/': '/auth/' },
    })
  );
  
  // Proxy /users routes directly
  router.use(
    '/',
    createProxyMiddleware({
      target: route,
      changeOrigin: true,
      pathRewrite: { '^/': '/users' },
    })
  );

module.exports = router;
