var express = require('express');
var app = express();

var places = [
  {
    name: 'Grand Canyon',
    img: 'https://www.canyontours.com/wp-content/uploads/2013/09/West-Rim.jpg'
  },
  {
    name: 'Zion',
    img:
      'https://www.worldatlas.com/r/w728-h425-c728x425/upload/13/c1/9a/zion-canyon.jpg'
  },
  {
    name: 'Arches',
    img: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Delicatearch1.jpg'
  },
  {
    name: 'Half Dome',
    img:
      'https://www.outdoorwomensalliance.com/wp-content/uploads/2016/01/half-dome-yosemite-valley-visitation.jpg'
  }
];

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/places', function(req, res) {
  res.render('places', { places: places });
});

app.listen(4000, function() {
  console.log('Server is running here');
});
