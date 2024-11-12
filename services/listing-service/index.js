const express = require('express');
const connectToDatabase = require('../../shared/config/dbConfig'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());

// Connect to the Database
connectToDatabase(/*process.env.MONGO_URI*/);

// Routes
app.get('/', (req, res) => {
  res.send('Listing Service is running');
});


app.get('/listings', (req, res) => {
    //finish
  res.json({ message: 'Listings fetched successfully' });
});

app.listen(PORT, () => {
  console.log(`Listing Service running on port ${PORT}`);
});
