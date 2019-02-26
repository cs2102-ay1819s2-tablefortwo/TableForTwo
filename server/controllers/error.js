'use strict';

let index = (req, res) => {
    res.render('error/index', {
        title: 'Error',
        details: req
    });
};

module.exports = { index: index };