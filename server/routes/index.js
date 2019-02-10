'use strict';
/**
 * This file handles the main routing from the server.
 * It does so by directing requests from the server to 
 * individual routers.
 * 
 * */
const homeRoute = require('./home'),
      errorRoute = require('./error');

let init = (server) => {
    server.get('*', (req, res, next) => {
        console.log('Request made to ' + req.originalUrl);
        next();
    });

    // Base route
    server.get('/', (req, res) => {
        res.redirect('/home');
    });

    server.use('/home', homeRoute);
    server.use('/error', errorRoute);
};

module.exports = { init: init };