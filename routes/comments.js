var express = require('express');
var router = express.Router({ mergeParams: true });
var Place = require('../models/place');
var Comment = require('../models/comment');
var middleware = require('../middleware'); // automaticly will look for index.js in the directory, so no need to specify

// comments new route
router.get('/new', middleware.isLoggedIn, function(req, res) {
  Place.findById(req.params.id, function(err, place) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { place: place });
    }
  });
});

// comments create route
router.post('/', middleware.isLoggedIn, function(req, res) {
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
          req.flash('error', 'Something went wrong');
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          //connect new comment to place
          place.comments.push(comment);
          place.save();
          // redirect to place show page
          req.flash('success', 'Successfully added comment');
          res.redirect('/places/' + place._id);
        }
      });
    }
  });
});

// comments edit route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(
  req,
  res
) {
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
router.put('/:comment_id', middleware.checkCommentOwnership, function(
  req,
  res
) {
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
router.delete('/:comment_id', middleware.checkCommentOwnership, function(
  req,
  res
) {
  // find by id and remove
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect('/places/' + req.params.id);
    }
  });
});

module.exports = router;
