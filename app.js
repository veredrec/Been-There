var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Place = require('./models/place'),
  seedDB = require('./seeds');

seedDB();
mongoose.connect('mongodb://localhost/been_there');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

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
      res.render('index', { places: allPlaces });
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
  res.render('new.ejs');
});

app.get('/places/:id', function(req, res) {
  Place.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundPlace) {
      if (err) {
        console.log(err);
      } else {
        res.render('show', { place: foundPlace });
      }
    });
});

app.listen(4000, function() {
  console.log('Server is running here');
});
