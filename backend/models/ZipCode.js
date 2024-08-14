const mongoose = require('mongoose');

const ZipCodeSchema = new mongoose.Schema({
  zip: { type: String, required: true, unique: true, index: true },
  coords: { type: String, required: true },
});

const ZipCode = mongoose.model('ZipCode', ZipCodeSchema);

module.exports = ZipCode;
