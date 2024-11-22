// src/index.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));
}

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
}
else {
module.exports = app}