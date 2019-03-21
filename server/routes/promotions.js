'use strict';

const express = require('express');
const promotionsController = require('../controllers/promotions');
let router = express.Router();

router.get('/:promoId', promotionsController.show);
router.get('/new', promotionsController.new);
router.post('/new', promotionsController.create);

module.exports = router;
