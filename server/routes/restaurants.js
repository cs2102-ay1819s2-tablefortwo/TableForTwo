'use strict';

const express = require('express');
const restaurantController = require('../controllers/restaurants');
const branchController = require('../controllers/branch');
let router = express.Router();

router.get('/', restaurantController.viewRestaurants);
router.get('/:restaurant_id/branches/:branch_id', branchController.getBranch);
router.post('/:restaurant_id/branches/:branch_id/book', branchController.reserveTimeslot);

module.exports = router;
