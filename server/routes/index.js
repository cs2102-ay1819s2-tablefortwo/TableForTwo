'use strict';
/**
 * This file handles the main routing from the server.
 * It does so by directing requests from the server to 
 * individual routers.
 * 
 * */

const logoutRoute = require('./logout'),
      signupRoute = require('./signup'),
      homeRoute = require('./home'),
      restaurantRoute = require('./restaurants'),
      searchRoute = require('./search'),
      promotionsRoute = require('./promotions'),
      reservationsRoute = require('./reservations'),
      pointsRoute = require('./points'),
      manageRoute = require('./manage'),
      errorRoute = require('./error');

let init = (server) => {
    // Base route
    server.use('/logout', logoutRoute);
    server.use('/signup', signupRoute);
    server.use('/home', homeRoute);
    server.use('/restaurants', restaurantRoute);
    server.use('/search', searchRoute);
    server.use('/promotions', promotionsRoute);
    server.use('/viewReservations', reservationsRoute);
    server.use('/points', pointsRoute);
    server.use('/manage', manageRoute);
    server.use('/error', errorRoute);

    server.get('/', (req, res, next) => {
        res.redirect('/home');
    });
    
    // No matching routes
    server.get((req, res, err, next) => res.redirect('/error'));
    
};

module.exports = { init: init };
