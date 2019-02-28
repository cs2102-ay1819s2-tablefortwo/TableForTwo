'use strict';
const db = require('../../server/helpers/database').db;
const branchQueries = require('../../sqlQueries/restaurants');

let getBranch = (req, res) => {
    console.log('Displaying details for branch');
    console.log(JSON.stringify(req.body));

    let bid = req.body.bid;
    let bname = req.body.bname;
    let baddress = req.body.baddress;
    let bphone = req.body.bphone;

    db.query(branchQueries.getBranchMenuItems, [bid])
        .then(val => {
            // add menu items
            let foodItems = [];
            for (let i = 0; i < val.rowCount; i++) {
                let row = val.rows[i];
                let food = { name: row.name, price: row.price };
                foodItems.push(food);
            }

            res.render('branch', { bname: bname, baddress: baddress, bphone: bphone, sells: foodItems });

        })
        .catch(err => {
            console.error(err);
        });
    
};

module.exports = getBranch;