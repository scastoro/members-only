const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) return done(err);
        if (res) {
          console.log('Logged In!');
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      });
      return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const router = express.Router();

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Log In' });
});

router.post(
  '/login/password',
  passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
  })
);

router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Sign Up' });
});

router.post(
  '/signup',
  body('username', 'Username must exist').trim().isLength({ min: 1 }).isEmail().escape(),
  body('password', 'Password must exist').trim().isLength({ min: 1 }).escape(),
  body('confirmPassword', 'Password confirmation field must have same value as password field')
    .trim()
    .isLength({ min: 1 })
    .custom((value, { req }) => value === req.body.password)
    .escape(),
  async function (req, res, next) {
    // Put new user handler function here
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.render('signup', { name: req.body.name, errors: errors.array(), title: 'Sign Up' });
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10).catch(next);

    console.log(hashedPassword);

    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      status: 'non-member',
      isAdmin: req.body.admin,
    });
    const response = await user.save().catch(next);

    if (response) {
      console.log(response);
      res.redirect('/');
    }
  }
);

module.exports = router;
