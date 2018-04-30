var Place = require('../models/place');
var Comment = require('../models/comment');
// Middleware functions

// middleware to check if a user owns the place post
function checkPlaceOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Place.findById(req.params.id, function(err, foundPlace) {
      if (err) {
        req.flash('error', 'Place not found');
        res.redirect('back');
      } else {
        // does user own the post
        if (foundPlace.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
}

// middleware to check if a user owns the comment
function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        console.log('Error with edit comment route ', err);
        res.redirect('back');
      } else {
        // does user own the comment
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
}

// middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to do that');
  res.redirect('/login');
}

module.exports = {
  checkPlaceOwnership,
  checkCommentOwnership,
  isLoggedIn
};
