'use strict';
/**
 * This file handles the main routing from the server.
 * It does so by directing requests from the server to 
 * individual routers.
 * 
 * */
const loginRoute = require('./login'),
      signupRoute = require('./signup'),
      homeRoute = require('./home'),
      errorRoute = require('./error');

let init = (server) => {
    // Base route
    server.use('/login', loginRoute);
    server.use('/signup', signupRoute);
    server.use('/home', homeRoute);
    server.use('/error', errorRoute);

    server.get('*', (req, res, next) => {
        console.log('Request made to ' + req.originalUrl);
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }
        next();
    });

    server.get('/', (req, res, next) => {
        res.redirect('/home');
    });
    
    // No matching routes
    server.get((req, res, err, next) => res.redirect('/error'));
    
};

module.exports = { init: init };