var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  Place = require('./models/place'),
  Comment = require('./models/comment'),
  User = require('./models/user'),
  seedDB = require('./seeds');

mongoose.connect('mongodb://localhost/been_there');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

seedDB();

// Passport configuration
app.use(
  require('express-session')({
    secret: 'this is great',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/places', function(req, res) {
  //Get all places from database
  Place.find({}, function(err, allPlaces) {
    if (err) {
      console.log('ERROR ', err);
    } else {
      //Render the places page
      res.render('places/index', { places: allPlaces, currentUser: req.user });
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

// Comments routes & isLoggedIn to check if the user is logged in before can add a comment
app.get('/places/:id/comments/new', isLoggedIn, function(req, res) {
  Place.findById(req.params.id, function(err, place) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { place: place });
    }
  });
});

app.post('/places/:id/comments', isLoggedIn, function(req, res) {
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

// AUTH ROUTES

// show signup form
app.get('/signup', function(req, res) {
  res.render('signup');
});

// sign up logic
app.post('/signup', function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('signup');
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/places');
    });
  });
});

// show login form
app.get('/login', function(req, res) {
  res.render('login');
});

// login logic
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/places',
    failureRedirect: '/login'
  }),
  function(req, res) {}
);

// logout logic
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/places');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.listen(4000, function() {
  console.log('Server is running here');
});
