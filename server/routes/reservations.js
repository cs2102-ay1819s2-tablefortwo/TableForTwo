'use strict';

const express = require('express');
const reservationsController = require('../controllers/reservations');
let router = express.Router();

router.get('/', reservationsController.viewReservations);
router.post('/confirmReservation/', reservationsController.confirmReservation);

module.exports = router;
