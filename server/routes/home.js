'use strict';

const express = require('express');
const homeController = require('../controllers/home');
let router = express.Router();

router.get('/', homeController.index);
router.post('/', homeController.handleLoginValidation);
router.post('/search', homeController.search);
router.get('/restaurants', homeController.viewRestaurants);
router.get('/branch/:bid', homeController.getBranches);

module.exports = router;
