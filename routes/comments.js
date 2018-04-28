var express = require('express');
var router = express.Router({ mergeParams: true });
var Place = require('../models/place');
var Comment = require('../models/comment');

// comments new route
router.get('/new', isLoggedIn, function(req, res) {
  Place.findById(req.params.id, function(err, place) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { place: place });
    }
  });
});

// comments create route
router.post('/', isLoggedIn, function(req, res) {
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
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
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

// comments edit route
router.get('/:comment_id/edit', checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      res.redirect('back');
    } else {
      res.render('comments/edit', {
        place_id: req.params.id,
        comment: foundComment
      });
    }
  });
});

// comment update route
router.put('/:comment_id', checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
    err,
    updatedComment
  ) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/places/' + req.params.id);
    }
  });
});

// comment delete route
router.delete('/:comment_id', checkCommentOwnership, function(req, res) {
  // find by id and remove
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/places/' + req.params.id);
    }
  });
});

// middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
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
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
}

module.exports = router;
