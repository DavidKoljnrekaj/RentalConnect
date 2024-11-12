const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());


// Routes
app.get('/', (req, res) => {
  res.send('Api Gateway is running');
});


app.get('/', (req, res) => {
    //finish
  res.json({ message: '' });
});

app.listen(PORT, () => {
  console.log(`Api Gateway running on port ${PORT}`);
});
