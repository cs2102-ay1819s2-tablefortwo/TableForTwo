'use strict';

const express = require('express');
const manageController = require('../controllers/manage');
let router = express.Router();

router.get('/', manageController.getOverview);
router.post('/deleteslot', manageController.deleteSlot);
<<<<<<< HEAD
router.post('/addSlot', manageController.addSlot);
=======
>>>>>>> 695cd6a42a63c4d9d5db74125ac699aa595358ee

module.exports = router;