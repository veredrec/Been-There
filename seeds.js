var mongoose = require('mongoose');
var Place = require('./models/place');
var Comment = require('./models/comment');

var data = [
  {
    name: 'Arches',
    img:
      'https://utahcdn.azureedge.net/media/2158/arches-delicate-arch-slide.jpg?anchor=center&mode=crop&width=875&height=583&rnd=131423660350000000',
    desc: 'Amazing hikings and wonderful place'
  },
  {
    name: 'Zion',
    img: 'https://media.mnn.com/assets/images/2016/05/zion-national-park.jpg',
    desc: 'Amazing hikings and wonderful place'
  },
  {
    name: 'Grand Canyon',
    img: 'https://www.canyontours.com/wp-content/uploads/2013/09/West-Rim.jpg',
    desc: 'Amazing hikings and wonderful place'
  },
  {
    name: 'Half Dome',
    img:
      'https://www.rei.com/adventures/assets/adventures/images/trip/core/northamerica/yhd_hero',
    desc: 'Amazing hikings and wonderful place'
  }
];

function seedDB() {
  //Remove all places
  Place.remove({}, function(err) {
    if (err) {
      console.log(err);
    }
    console.log('removed places');
    Comment.remove({}, function(err) {
      if (err) {
        console.log(err);
      }
      console.log('removed comments!');
      // add a few campgrounds
      data.forEach(function(seed) {
        Place.create(seed, function(err, place) {
          if (err) {
            console.log(err);
          } else {
            console.log('added a place');
            //create a comment
            Comment.create(
              {
                text: 'This place is great, but I wish there was internet',
                author: 'Homer'
              },
              function(err, comment) {
                if (err) {
                  console.log(err);
                } else {
                  place.comments.push(comment);
                  place.save();
                  console.log('Created new comment');
                }
              }
            );
          }
        });
      });
    });
  });
}

module.exports = seedDB;
