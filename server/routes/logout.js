'use strict';

const express = require('express');
const logout = require('../controllers/logout');
let router = express.Router();

router.get('/', logout);

module.exports = router;