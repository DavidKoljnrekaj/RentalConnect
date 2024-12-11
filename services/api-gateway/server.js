const express = require('express');
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');
const searchRoutes = require('./routes/searchRoutes');
const cors = require('cors');

module.exports = () => {
  const app = express();

  app.use(cors());

  // Mount routes
  app.use('/users', userRoutes);
  app.use('/listings', listingRoutes);
  app.use('/search', searchRoutes);

  // Middleware for parsing JSON
  app.use(express.json());


  // Default error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
  });

  return app;
};
