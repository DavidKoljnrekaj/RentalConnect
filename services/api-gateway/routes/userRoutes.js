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
    (req, res, next) => {
      // Log the incoming request and the proxied target
      console.log(`Proxying request to: ${route}${req.url}`);
      console.log(`Method: ${req.method}`);
      console.log(`Headers:`, req.headers);
  
      next();
    },
    createProxyMiddleware({
      target: route,
      changeOrigin: true,
      pathRewrite: { '^/': '/auth/' },
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
  
  // Proxy /users routes directly
  router.use(
    '/',
    (req, res, next) => {
      // Log the incoming request and the proxied target
      console.log(`Proxying request to: ${route}${req.url}`);
      console.log(`Method: ${req.method}`);
      console.log(`Headers:`, req.headers);
  
      next();
    },
    createProxyMiddleware({
      target: route,
      changeOrigin: true,
      pathRewrite: { '^/': '/users/' },
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
