'use strict';
const db = require('../../server/helpers/database').db;
const searchQuery = require('../../sqlQueries/searchFoodItems');

let navBarSearch = (req, res) => {
    console.log("navbarsearch " + req.body);
    let userQuery = req.body.search_query.trim();
    let filter = req.body.filter;

    if (filter === 'foodname') { // only foodName specified
        // search by foodName only
        db.query(searchQuery.findByName, [userQuery])
            .then(val => {
                if (val) {
                    res.send(val.rows);
                }
            })
            .catch(err => {
                console.error(err);
            });
    } else if (filter === 'location') {
        // search by location only
        db.query(searchQuery.findByLocation, [userQuery])
            .then(val => {
                if (val) {
                    res.send(val.rows);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }
};

let homepageSearch = (req, res) => {
    console.log("homepagesearch " + req.body);
    let foodName = req.body.foodname.trim();
    let location = req.body.location.trim();

    console.log('foodname: ', foodName, 'location: ', location);
    // performs a logical AND to find all restaurants selling foodName and at location
    if (foodName && location && foodName !== "" && location != "") {
        console.log('search by foodname and location', foodName, location);
        db.query(searchQuery.findByNameAndLocation, [foodName, location])
            .then(val => {
                if (val) {
                    res.send(val.rows);
                } else {
                    res.send( "No data" );
                }
            })
            .catch(err => {
                console.error(err);
            });
    } else if (foodName != undefined) { // only foodName specified
        // search by foodName only
        console.log('search by foodname', foodName);
        db.query(searchQuery.findByName, [foodName])
            .then(val => {
                if (val) {
                    res.send(val.rows);
                } else {
                    res.send("No data");
                }
            })
            .catch(err => {
                console.error(err);
            });
    } else if (location != undefined) {
        // search by location only
        console.log('search by location', location);
        db.query(searchQuery.findByLocation, [location])
            .then(val => {
                if (val) {
                    res.send(val.rows);
                } else {
                    res.send( "" );
                }
            })
            .catch(err => {
                console.error(err);
            });
    }
};

module.exports = { navBarSearch: navBarSearch, homepageSearch: homepageSearch };