// models/User.js
const mongoose = require('mongoose');

const ZipCodeSchema = new mongoose.Schema({
  zip: { type: String, required: true, unique: true, index: true },
  coords: { type: String, required: true, unique: true, index: true },
});

const ZipCode = mongoose.model('User', ZipCodeSchema);

module.exports = ZipCode;
