const express = require('express');
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');
const searchRoutes = require('./routes/searchRoutes');
const cors = require('cors');

module.exports = () => {
  const app = express();

  console.log("User service url:" + process.env.USER_SERVICE_URL)
  console.log("Listing service url:" + process.env.LISTING_SERVICE_URL)
  console.log("Search service url:" + process.env.SEARCH_SERVICE_URL)

  app.use(cors());

    // Middleware for parsing JSON
    app.use(express.json());

  // Mount routes
  app.use('/users', userRoutes);
  app.use('/listings', listingRoutes);
  app.use('/search', searchRoutes);




  // Default error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
  });

  return app;
};
