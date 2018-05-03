var mongoose = require('mongoose');

// SCHEMA
var placeSchema = new mongoose.Schema({
  name: String,
  price: String,
  img: String,
  desc: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('Place', placeSchema);
