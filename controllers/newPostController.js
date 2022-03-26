const Posts = require('../models/posts');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

exports.new_post_get = function (req, res, next) {
  res.render('newPost', { title: 'New Post', user: req.user });
};

exports.new_post_post = [
  body('title', 'Title is required').trim().isLength({ min: 1 }).escape(),
  body('body', 'Post Body is required').trim().isLength({ min: 1 }).escape(),
  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('newPost', {
        title: 'New Post',
        content: { title: req.body.title, body: req.body.body },
        errors: errors.array(),
      });
      console.log(errors.array());
      return;
    }
    const post = new Posts({
      title: req.body.title,
      body: req.body.body,
      author: req.user._id,
    });

    const response = await post.save().catch(next);

    if (response) {
      console.log(response);
      const userResponse = await User.findByIdAndUpdate(req.user._id, {
        $push: { posts: response._id },
      }).catch(next);
      console.log(userResponse);
      res.redirect('/');
    }
  },
];
