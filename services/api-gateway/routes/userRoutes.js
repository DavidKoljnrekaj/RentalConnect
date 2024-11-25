const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Proxy /auth routes under /users/auth
router.use(
    '/auth',
    createProxyMiddleware({
      target: process.env.USER_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/users/auth': '/auth' }, // Rewrite /users/auth to /auth for User Service
    })
  );
  
  // Proxy /users routes directly
  router.use(
    '/',
    createProxyMiddleware({
      target: process.env.USER_SERVICE_URL,
      changeOrigin: true,
    })
  );

module.exports = router;
