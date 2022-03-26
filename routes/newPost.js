const express = require('express');
const router = express.Router();
const newPostController = require('../controllers/newPostController');

router.get('/', newPostController.new_post_get);

router.post('/', newPostController.new_post_post);

module.exports = router;
