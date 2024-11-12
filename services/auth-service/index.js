const express = require('express');
const connectToDatabase = require('../../shared/config/dbConfig'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Connect to the Database
connectToDatabase(/*process.env.MONGO_URI*/);

// Routes
app.get('/', (req, res) => {
  res.send('Auth Service is running');
});


app.post('/login', (req, res) => {
    //finish
  res.json({ message: 'Logged in successfuly' });
});

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
