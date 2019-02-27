'use strict';
const db = require('../../server/helpers/database').db;
const searchQuery = require('../../sqlQueries/searchFoodItems');
const restaurantsQuery = require('../../sqlQueries/restaurants');
const passport = require('passport');

let index = (req, res) => {
    if (req.isAuthenticated()) {
        const user = {
            id: req.session.passport.user,
            isloggedin: req.isAuthenticated()
        };
        let userDetails = user.id[0];
        return res.render('home', { layout: 'index', title: 'Home', user: userDetails, isLoggedIn: user.isloggedin });
    } else {
        return res.render('home', { layout: 'index', title: 'Home', isLoggedIn: req.isAuthenticated() });
    }
};

let search = (req, res) => {
    let foodName = req.body.foodName;
    let location = req.body.location;

    // performs a logical AND to find all restaurants selling foodName and at location
    if (foodName != undefined && location != undefined) {
        db.query(searchQuery.findByNameAndLocation, [foodName, location])
            .then(val => {
                if (val) {
                    res.send(val.rows);
                }
            })
            .catch(err => {
                console.error(err);
                next(err);
            });
    } else if (foodName != undefined) { // only foodName specified
        // search by foodName only
        db.query(searchQuery.findByName, [foodName])
            .then(val => {
                if (val) {
                    res.send(val.rows);
                }
            })
            .catch(err => {
                console.error(err);
                next(err);
            });
    } else if (location != undefined) { 
        // search by location only
        db.query(searchQuery.findByLocation, [location])
            .then(val => {
                if (val) {
                    res.send(val.rows);
                }
            })
            .catch(err => {
                console.error(err);
                next(err);
            });
    }
};

    let handleLoginValidation = (req, res, next) => {
    console.log('Handling login validation' + req.body.name);
    passport.authenticate('local-login', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (!user) {
            req.flash('failure', 'invalid login');
            res.locals.message = 'invalid login';
            res.redirect('./');
        }

        req.login(user, loginErr => {
            if (loginErr) {
                next(loginErr);
            }

            res.locals.message = 'successful login';
            res.cookie('user_name', user.nane);
            res.cookie('user_id', user.id);
            return res.redirect('../home');
        });
    })(req, res, next);
};

let viewRestaurants = (req, res) => {
    let dictionary = {};
    db.query(restaurantsQuery.allRestaurants)
        .then(restaurants => {
            for (let i = 0; i < restaurants.rowCount; i++) {
                let r = restaurants.rows[i];

                db.query(restaurantsQuery.getAssocBranches, [r.id])
                    .then(br => {
                        r.branches = br;
                        dictionary[r.rname] = r;
                    })
                    .catch(next(err))
            }

            res.render('restaurants', { layout: 'index', title: 'All Restaurants', restaurants: dictionary });
        })
        .catch(err => {
            console.error(err);
            next(err);
        });
    return dictionary;
}

module.exports = { index: index, handleLoginValidation: handleLoginValidation, search: search, viewRestaurants: viewRestaurants };
