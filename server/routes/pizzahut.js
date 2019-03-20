'use strict';

const express = require('express');
const pizzahutController = require('../controllers/pizzahut');
let router = express.Router();

router.get('/', pizzahutController.index);

module.exports = router;