const Posts = require('../models/posts');
const date = require('date-fns');

exports.get = async function (req, res, next) {
  const posts = await Posts.find({}).populate('author').catch(next);
  // console.log(posts);
  console.log(req.user);
  res.render('index', { title: 'Members Only', user: req.user, posts: posts, date: date });
};

exports.delete_entry = async function (req, res, next) {
  // Find and delete post by id req.params.userId
  // Figure out way to remove post id from User's posts field
  // Find user from post author field then update user and pop off post id from posts array
  const response = await Posts.findByIdAndDelete(req.params.userId).catch(next);
  console.log(response);
  res.redirect('/');
};
