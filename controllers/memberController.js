require('dotenv').config();
const User = require('../models/user');

exports.get = function (req, res, next) {
  res.render('member', { title: 'Become a member', user: req.user });
};

exports.post = async function (req, res, next) {
  // Placeholder to compare password to stored password
  // And grant membership if passwords match
  if (req.body.password === process.env.SECRET_PASSWORD) {
    console.log('Correct Answer!');
    const response = await User.findByIdAndUpdate(req.user._id, { status: 'member' }).catch(next);
    console.log(response);
    res.redirect(301, '/');
  } else {
    console.log('Wrong Answer...');
    res.render('member', { title: 'Become a member', error: 'Wrong password...' });
  }
};
