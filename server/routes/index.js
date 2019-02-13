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
    server.get('/', (req, res, next) => {
        res.redirect('/home');
        res.status = 200;
    });
    server.use('/home', homeRoute);

    // No matching routes
    server.use((err, req, res, next) => {
        res.status = 404;
        res.redirect('/error', { error: err });
    });
    server.use('/error', errorRoute);
};

module.exports = { init: init };