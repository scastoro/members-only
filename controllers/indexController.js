const Posts = require('../models/posts');
const Users = require('../models/user');
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
  const postsResponse = await Posts.findById(req.params.userId).catch(next);
  const usersResponse = await Users.findByIdAndUpdate(postsResponse.author, {
    $pull: { posts: req.params.userId },
  }).catch(next);
  const deleteResponse = await Posts.findByIdAndDelete(req.params.userId).catch(next);
  console.log(deleteResponse);
  res.redirect('/');
};
