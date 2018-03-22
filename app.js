var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var places = [
  {
    name: 'Grand Canyon',
    img: 'https://www.canyontours.com/wp-content/uploads/2013/09/West-Rim.jpg'
  },
  {
    name: 'Zion',
    img: 'https://media.mnn.com/assets/images/2016/05/zion-national-park.jpg'
  },
  {
    name: 'Arches',
    img:
      'https://utahcdn.azureedge.net/media/2158/arches-delicate-arch-slide.jpg?anchor=center&mode=crop&width=875&height=583&rnd=131423660350000000'
  },
  {
    name: 'Half Dome',
    img:
      'https://www.rei.com/adventures/assets/adventures/images/trip/core/northamerica/yhd_hero'
  }
];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/places', function(req, res) {
  res.render('places', { places: places });
});

app.post('/places', function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var newPlace = { name: name, image: image };
  places.push(newPlace);
  res.redirect('/places');
});

app.get('/places/new', function(req, res) {
  res.render('new.ejs');
});

app.listen(4000, function() {
  console.log('Server is running here');
});
