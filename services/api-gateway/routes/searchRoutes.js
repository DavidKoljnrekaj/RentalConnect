const express = require('express');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
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
