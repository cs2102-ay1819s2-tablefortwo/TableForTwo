'use strict';
const db = require('../../server/helpers/database').db;
const searchQuery = require('../../sqlQueries/searchFoodItems');

let index = (req, res) => {
    if (req.isAuthenticated()) {
        let user = {
            id: req.session.passport.user,
            isloggedin: req.isAuthenticated()
        };

        let userDetails = user.id[0];
        return res.render('home', { layout: 'index', title: 'Home', user: userDetails, isLoggedIn: user.isloggedin });
    }
};

let data = (req, res) => {
    let foodName = req.body.foodName;
    let location = req.body.location;

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
    } else if (foodName != undefined) {
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

module.exports = { index: index, data: data };
