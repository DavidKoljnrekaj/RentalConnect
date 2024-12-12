const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  role: { type: String, enum: ['client', 'admin'], required: true, default: 'client' }, // Role of the user
  favorites: [{ type: String }], // Array of listing IDs
});

module.exports = mongoose.model('User', userSchema);
