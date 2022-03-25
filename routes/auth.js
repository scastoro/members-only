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
  res.render('login');
});

router.post(
  '/login/password',
  passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
  })
);

router.post('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/signup', function (req, res, next) {
  res.render('signup');
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
      res.render('signup', { name: req.body.name, errors: errors.array() });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 100).catch((err) => next(err));

    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      status: 'non-member',
      isAdmin: req.body.admin,
    });

    const response = await user.save().catch((err) => next(err));

    console.log(response);

    res.redirect('/');
  }
);
