'use strict';

const express = require('express');
const reservationsController = require('../controllers/reservations');
let router = express.Router();

router.get('/', reservationsController.viewReservations);
router.post('/confirmReservation/', reservationsController.confirmReservation);
router.post('/deleteReservation', reservationsController.deleteReservation);
router.post('/updateReservation', reservationsController.updateReservation);

module.exports = router;
