'use strict';

const express = require('express');
const signup = require('../controllers/signup');
let router = express.Router();

router.get('/', signup.index);
router.post('/', signup.handleSignup);

module.exports = router;