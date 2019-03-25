'use strict';

const express = require('express');
const homeController = require('../controllers/home');
let router = express.Router();

router.get('/', homeController.index);
router.post('/search', homeController.search);
router.post('/restaurants', homeController.viewRestaurants);
router.all('/branch', homeController.getBranch);
router.post('/login', homeController.handleLoginValidation);

module.exports = router;
