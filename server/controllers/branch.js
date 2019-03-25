'use strict';
const db = require('../../server/helpers/database').db;
const branchQueries = require('../../sqlQueries/restaurantsQueries');

let getBranch = (req, res) => {
    console.log('Displaying details for branch');
    console.log(JSON.stringify(req.body));

    let rname = req.body.rname;
    let bid = req.body.bid;
    let bname = req.body.bname;
    let baddress = req.body.baddress;
    let bphone = req.body.bphone;
    let rimage = encodeURI('../images/' + rname + '.jpg');
    let timeslots = [];

    db.query(branchQueries.getTimeslots, [bid])
        .then(val => {
            for (let i = 0; i < val.rowCount; i++) {
                let row = val.rows[i];
                let timeSlot = { timing: row.timeslot, slots: row.numslots, id: row.branch_id };
                timeslots.push(timeSlot);
            }
        })
        .catch(err => {
            console.error(err);
        });

    db.query(branchQueries.getBranchMenuItems, [bid])
        .then(val => {
            // add menu items
            let foodItems = [];
            for (let i = 0; i < val.rowCount; i++) {
                let row = val.rows[i];
                let food = { name: row.name, price: row.price };
                foodItems.push(food);
            }
            res.render('branch', { rimage: rimage, bname: bname, baddress: baddress, bphone: bphone, timeslots: timeslots, sells: foodItems });

        })
        .catch(err => {
            console.error(err);
        });
    
};

module.exports = getBranch;