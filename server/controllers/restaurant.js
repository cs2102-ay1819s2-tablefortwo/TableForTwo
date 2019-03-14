'use strict';
const db = require('../../server/helpers/database').db;
const restaurantsQuery = require('../../sqlQueries/restaurants');

let viewRestaurants = (req, res) => {
    let dictionary = [];
    console.log('Retrieving all restaurants');
    db.query(restaurantsQuery.allRestaurantsAndBranches)
        .then(val => {
            if (!val || val.rowCount == 0) return;
            let rows = val.rows;

            for (let i = 0; i < val.rowCount; i++) {
                let rid = rows[i].restaurant_id - 1;
                let branch = { bid: rows[i].branch_id, bname: rows[i].bname, bphone: rows[i].bphone, baddress: rows[i].baddress, barea: rows[i].barea };
                if (dictionary[rid] == undefined) {
                    let branches = [];
                    branches.push(branch);
                    dictionary[rid] = { rid: rows[i].restaurant_id, rname: rows[i].rname, rphone: rows[i].rphone, raddress: rows[i].raddress, branches: branches };

                } else {
                    let branches = dictionary[rid].branches;
                    branches.push(branch);
                    dictionary[rid].branches = branches;
                }
            }
            console.log(JSON.stringify(dictionary));
            res.render('restaurants', { layout: 'index', title: 'All Restaurants', restaurants: dictionary });
        });
};

module.exports = viewRestaurants;