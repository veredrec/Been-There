var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('./../models/user');

// HOME ROUTE
router.get('/', function(req, res) {
  res.render('home');
});

// AUTH ROUTES

// show signup form
router.get('/signup', function(req, res) {
  res.render('signup');
});

// sign up logic
router.post('/signup', function(req, res) {
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
router.get('/login', function(req, res) {
  res.render('login');
});

// login logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/places',
    failureRedirect: '/login'
  }),
  function(req, res) {}
);

// logout logic
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/places');
});

// middleware to check if user logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
