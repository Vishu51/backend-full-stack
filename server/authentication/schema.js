const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    role: {
      type: String,
      default: 'user'
    }
  });
  
  const AuthCollection = mongoose.model('SpecificUser', userSchema)
  module.exports = AuthCollection