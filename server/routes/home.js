'use strict';

const express = require('express');
const homeController = require('../controllers/home');
let router = express.Router();

router.get('/', homeController.index);
router.post('/', (req, res, next) => {
    console.log(JSON.stringify(req.body));
    homeController.data(req, res);
});

router.get('/data', (req, res, next) => {
    homeController.dataView(req, res);
});

module.exports = router;
