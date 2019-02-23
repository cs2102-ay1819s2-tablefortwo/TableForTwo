'use strict';
/**
 * This file handles the main routing from the server.
 * It does so by directing requests from the server to 
 * individual routers.
 * 
 * */
const loginRoute = require('./login'),
      homeRoute = require('./home'),
      errorRoute = require('./error');

let init = (server) => {
    server.get('*', (req, res, next) => {
        console.log('Request made to ' + req.originalUrl);
        next();
    });

    // Base route
    server.use('/login', loginRoute);
    server.use('/home', homeRoute);
    server.use('/error', errorRoute);

    server.get('/', (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }
        res.redirect('/home');
    });
    
    // No matching routes
    server.get((req, res, err, next) => res.redirect('/error'));
    
};

module.exports = { init: init };