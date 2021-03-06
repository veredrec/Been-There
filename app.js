var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  Place = require('./models/place'),
  Comment = require('./models/comment'),
  User = require('./models/user'),
  seedDB = require('./seeds');

// requiring routes
var commentsRoutes = require('./routes/comments');
var placesRoutes = require('./routes/places');
var indexRoutes = require('./routes/index');

mongoose.connect('mongodb://localhost/been_there');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// seedDB();

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
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use(indexRoutes);
app.use('/places', placesRoutes);
app.use('/places/:id/comments', commentsRoutes);

app.listen(4000, function() {
  console.log('Server is running here');
});
