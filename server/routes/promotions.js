'use strict';

const express = require('express');
const promotionsController = require('../controllers/promotions');
let router = express.Router();

router.get('/new', promotionsController.new);
router.post('/new', promotionsController.create);
router.get('/:promoId/edit', promotionsController.edit);
router.post('/:promoId/update', promotionsController.update);
router.post('/:promoId/delete', promotionsController.delete);
router.get('/:promoId', promotionsController.show);


module.exports = router;
