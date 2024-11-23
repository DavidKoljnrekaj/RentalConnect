const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const listingRoutes = require('./routes/listingRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));
}


app.use('/listings', listingRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Listing Service running on port ${PORT}`));
}
else {
module.exports = app
}
