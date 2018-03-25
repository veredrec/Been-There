var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Place = require('./models/place'),
  Comment = require('./models/comment');
seedDB = require('./seeds');

mongoose.connect('mongodb://localhost/been_there');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

seedDB();

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/places', function(req, res) {
  //GET ALL PLACES FROM DB
  Place.find({}, function(err, allPlaces) {
    if (err) {
      console.log('ERROR ', err);
    } else {
      //RENDER THE PLACES PAGE
      res.render('places/index', { places: allPlaces });
    }
  });
});

app.post('/places', function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newPlace = { name: name, img: image, desc: description };
  //CREATE NEW PLACE AND ADD TO DB
  Place.create(newPlace, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/places');
    }
  });
});

app.get('/places/new', function(req, res) {
  res.render('places/new');
});

app.get('/places/:id', function(req, res) {
  Place.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundPlace) {
      if (err) {
        console.log(err);
      } else {
        res.render('places/show', { place: foundPlace });
      }
    });
});

// Comments routes
app.get('/places/:id/comments/new', function(req, res) {
  Place.findById(req.params.id, function(err, place) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { place: place });
    }
  });
});

app.post('/places/:id/comments', function(req, res) {
  // lookup place using id
  Place.findById(req.params.id, function(err, place) {
    if (err) {
      console.log(err);
      res.redirect('/places');
    } else {
      // create new comment
      Comment.create(req.body.comment, function(err, comment) {
        // an object with the author and the text, from the submitted form
        if (err) {
          console.log(err);
        } else {
          //connect new comment to place
          place.comments.push(comment);
          place.save();
          // redirect to place show page
          res.redirect('/places/' + place._id);
        }
      });
    }
  });
});

app.listen(4000, function() {
  console.log('Server is running here');
});
