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
        console.log('Error in show place ', err);
        console.log(req.params.id);
        res.redirect('/places');
      } else {
        res.render('places/show', { place: foundPlace });
      }
    });
});

// Edit place
router.get('/:id/edit', function(req, res) {
  Place.findById(req.params.id, function(err, foundPlace) {
    if (err) {
      console.log('Error with edit route ', err);
      res.redirect('/places');
    } else {
      res.render('places/edit', { place: foundPlace });
    }
  });
});

// Update place after editing
router.put('/:id', function(req, res) {
  // find and update the place
  Place.findByIdAndUpdate(req.params.id, req.body.place, function(
    err,
    updatedPlace
  ) {
    if (err) {
      console.log('Error with find and update ', err);
      res.redirect('/places');
    } else {
      // redirect to the show page to see changes
      res.redirect('/places/' + req.params.id);
    }
  });
});

// Delete place
router.delete('/:id', function(req, res) {
  Place.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log('Error in delete ', err);
      res.redirect('/places');
    } else {
      res.redirect('places');
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
