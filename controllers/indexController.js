const Posts = require('../models/posts');

exports.get = async function (req, res, next) {
  const posts = await Posts.find({}).populate('author').catch(next);
  console.log(posts);
  console.log(req.user);
  res.render('index', { title: 'Members Only', user: req.user, posts: posts });
};

exports.delete_entry = function (req, res, next) {
  // Find and delete post by id req.params.userId
};
