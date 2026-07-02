const mongoose = require('mongoose');

// Yeh define karta hai ke ek "User" ka data kaisa dikhega
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Model banate hain is schema se
const User = mongoose.model('User', userSchema);

module.exports = User;