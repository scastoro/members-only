const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.get('/', memberController.get);

router.post('/', memberController.post);

module.exports = router;
