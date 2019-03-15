'use strict';
const searchQuery = require('../../sqlQueries/searchFoodItems');
const restaurantController = require('../controllers/restaurant');
const branchController = require('../controllers/branch');
const passport = require('passport');
const db = require('../../server/helpers/database').db;
const sqlQuery = require('../../sqlQueries/promotions');


let index = (req, res) => {
    Promise.all([db.query(sqlQuery.allPromotions)])
        .then(response => {
            const promotions = parsePromotions(response[0]);
            return res.render('home', { layout: 'index', title: 'Home', promotions: promotions });
        }).catch(error => {
            console.log(error);
    });
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
            res.redirect('./');
        }

        req.login(user, loginErr => {
            if (loginErr) {
                next(loginErr);
            }
            return res.redirect('../home');
        });
    })(req, res, next);
};

let viewRestaurants = (req, res) => restaurantController(req, res);
let getBranch = (req, res) => branchController(req, res);
let parsePromotions = (promoResponse) => {
    let promotions = [];
    for (let i = 0; i < promoResponse.rowCount; i++) {
        let row = promoResponse.rows[i];
        promotions.push(row);
    }
    return promotions;
};

module.exports = { index: index, handleLoginValidation: handleLoginValidation, search: search, viewRestaurants: viewRestaurants, getBranch: getBranch };
