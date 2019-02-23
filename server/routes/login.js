'use strict';

const express = require('express');
const login = require('../controllers/login');
let router = express.Router();

router.get('/', login.index);

router.post('/', login.handleLoginValidation);

module.exports = router;