'use strict';

const express = require('express');
const homeController = require('../controllers/home');
let router = express.Router();

router.get('/', homeController.index);
router.post('/', homeController.index); // todo: to be changed to homeController.search
router.post('/search', homeController.search);
router.get('/restaurants', homeController.viewRestaurants);
router.post('/branch', homeController.getBranch);
router.post('/login', homeController.handleLoginValidation);

module.exports = router;
