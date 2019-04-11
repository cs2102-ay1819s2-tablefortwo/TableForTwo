'use strict';

const express = require('express');
const manageController = require('../controllers/manage');
let router = express.Router();

router.get('/', manageController.getOverview);
router.post('/deleteslot', manageController.deleteSlot);
router.post('/addSlot', manageController.addSlot);

module.exports = router;