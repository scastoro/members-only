const User = require('../models/user');

exports.get = function (req, res, next) {
  res.render('member', { title: 'Become a member' });
};

exports.post = function (req, res, next) {
  // Placeholder to compare password to stored password
  // And grant membership if passwords match
};
