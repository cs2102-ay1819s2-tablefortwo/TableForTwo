'use strict';

const express = require('express');
const homeController = require('../controllers/home');
let router = express.Router();

router.get('/', homeController.index);
router.post('/login', homeController.handleLoginValidation);

module.exports = router;
