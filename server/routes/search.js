'use strict';

const express = require('express');
const searchController = require('../controllers/search');
let router = express.Router();

router.post('/', (req, res, next) => {
    if (req.body.foodname || req.body.location) {
        return searchController.homepageSearch(req, res);
    } else if (req.body.search_query) {
        return searchController.navBarSearch(req, res);
    } 
    return next('Unable to find match in search routing');
});

module.exports = router;
