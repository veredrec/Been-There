var express = require('express');
var router = express.Router();
var Place = require('../models/place');

router.get('/', function(req, res) {
  //Get all places from database
  Place.find({}, function(err, allPlaces) {
    if (err) {
      console.log('Error ', err);
    } else {
      //Render the places page
      res.render('places/index', { places: allPlaces, currentUser: req.user });
    }
  });
});

// Create - add a new place
router.post('/', isLoggedIn, function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newPlace = { name: name, img: image, desc: description, author: author };
  // Create a new place in DB
  Place.create(newPlace, function(err, newlyCreated) {
    if (err) {
      console.log('Error ', err);
    } else {
      res.redirect('/places');
    }
  });
});

router.get('/new', isLoggedIn, function(req, res) {
  res.render('places/new');
});

// Get a place
router.get('/:id', function(req, res) {
  Place.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundPlace) {
      if (err) {
        console.log('Error ', err);
      } else {
        res.render('places/show', { place: foundPlace });
      }
    });
});

// middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
