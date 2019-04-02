const express = require('express');
let router = express.Router();
const restaurantController = require('../controllers/restaurant');

router.post('/', restaurantController.viewRestaurants);
router.post('/branch', restaurantController.getBranch);

module.exports = router;