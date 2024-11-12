const mongoose = require('mongoose');

// Default MongoDB URI
const defaultUri = 'mongodb://localhost:27017/defaultDatabase'; //ADD REAL URI

const connectToDatabase = async (uri = defaultUri) => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Connected to MongoDB at ${uri}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};

module.exports = connectToDatabase;