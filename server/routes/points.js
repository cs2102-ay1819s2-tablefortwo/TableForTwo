'use strict';

const express = require('express');
const pointsController = require('../controllers/points');
let router = express.Router();

router.get('/', pointsController.index);
router.post('/redeem', pointsController.redeem);

module.exports = router;
