var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Place = require('./models/place');

mongoose.connect('mongodb://localhost/been_there');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

//   {
//     name: 'Arches',
//    img:'https://utahcdn.azureedge.net/media/2158/arches-delicate-arch-slide.jpg?anchor=center&mode=crop&width=875&height=583&rnd=131423660350000000',
// description: 'Amazing hikings and wonderful place';
//   },
// {
// name: 'Zion',
// img: 'https://media.mnn.com/assets/images/2016/05/zion-national-park.jpg'
// },
// {
//   name: 'Grand Canyon',
//   img: 'https://www.canyontours.com/wp-content/uploads/2013/09/West-Rim.jpg'
// },
// {
//   name: 'Half Dome',
//   img: 'https://www.rei.com/adventures/assets/adventures/images/trip/core/northamerica/yhd_hero'
// }

// Place.create(
//   {
//     name: 'Arches',
//     img:
//       'https://utahcdn.azureedge.net/media/2158/arches-delicate-arch-slide.jpg?anchor=center&mode=crop&width=875&height=583&rnd=131423660350000000',
//     description: 'Amazing hikings and wonderful place'
//   },
//   function(err, place) {
//     if (err) {
//       console.log('ERROR ', err);
//     } else {
//       console.log('NEWLY CREATED PLACE');
//       console.log(place);
//     }
//   }
// );

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
  Place.findById(req.params.id, function(err, foundPlace) {
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
