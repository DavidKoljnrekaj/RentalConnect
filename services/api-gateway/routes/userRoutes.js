const express = require('express');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const route = process.env.USER_SERVICE_URL || 'http://localhost:3001'

router.post("/favorites", authMiddleware, async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'User ID not found in token' });
  }
  req.body = { ...req.body, userId: req.user.id };
  next();
});

// Remove favorite
router.delete("/favorites", authMiddleware, async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'User ID not found in token' });
  }
  req.body = { ...req.body, userId: req.user.id };
  next();
});


// Proxy /auth routes under /users/auth
router.use(
    '/auth',
    createProxyMiddleware({
      target: route,
      changeOrigin: true,
      pathRewrite: { '^/': '/auth/' },
      on: {
        proxyReq: fixRequestBody,
      },  
    })
  );
  
  // Proxy /users routes directly
  router.use(
    '/',
    createProxyMiddleware({
      target: route,
      changeOrigin: true,
      pathRewrite: { '^/': '/users/' },
      on: {
        proxyReq: fixRequestBody,
      },  
    })
  );

module.exports = router;
