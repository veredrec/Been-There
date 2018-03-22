var mongoose = require('mongoose');

// SCHEMA
var placeSchema = new mongoose.Schema({
  name: String,
  img: String,
  desc: String
});

module.exports = mongoose.model('Place', placeSchema);
