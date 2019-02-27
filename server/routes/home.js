'use strict';

const express = require('express');
const homeController = require('../controllers/home');
let router = express.Router();

router.get('/', homeController.index);
router.post('/', homeController.data);

module.exports = router;
