const express = require('express');
const mongoose = require('mongoose');
//const connectToDatabase = require('../../shared/config/dbConfig');  IMPLEMENT LATER
require('dotenv').config();

const searchRoutes = require('./routes/searchRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://admin:ClbUJCmpRWGLTQBd@rentalconnectcluster.4kr7k.mongodb.net/?retryWrites=true&w=majority&appName=RentalConnectCluster')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));
}

// Routes
app.use('/search', searchRoutes);

// Start the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Listing Service running on port ${PORT}`));
}
else {
module.exports = app
}