const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.user);
  res.render('index', { title: 'Members Only', user: req.user });
});

module.exports = router;
