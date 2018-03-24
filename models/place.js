var mongoose = require('mongoose');

// SCHEMA
var placeSchema = new mongoose.Schema({
  name: String,
  img: String,
  desc: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('Place', placeSchema);
