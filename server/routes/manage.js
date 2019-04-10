'use strict';

const express = require('express');
const manageController = require('../controllers/manage');
let router = express.Router();

router.get('/', manageController.getOverview);

module.exports = router;