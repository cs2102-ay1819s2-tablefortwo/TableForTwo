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
                let reservedSeats = countReservations(row.branch_id, row.timeslot);
                //console.log("resrrved: " + reservedSeats);
                const slotsLeft = row.numslots - reservedSeats;
                //console.log("slots left: " + slotsLeft);
                let timeSlot = { timing: row.timeslot, slots: slotsLeft, br_id: row.branch_id };
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

let reserveTimeslot = (req, res) => {
    console.log('Reserving timeslot');
    console.log(JSON.stringify(req.body));

    let bookingInfo = [1];   // TODO: customer_id
    bookingInfo.push(req.body.bid);
    bookingInfo.push(req.body.pax);
    bookingInfo.push(req.body.timing);
    
    db.query(branchQueries.makeReservation, bookingInfo)
        .then(() => {
            console.log("successfully booked ");
            req.flash('success', `Booking at '${req.body.timing}' has been added!`);
            res.redirect('/home');
        }).catch(error => {
            req.flash('error', `Unable to make reservation at '${req.body.timing}'`);
            res.redirect('/home');
        });
};

function countReservations(branch_id, time) {
    let totalReservations = 0;
    console.log([branch_id, time]);
    db.query(branchQueries.countReservations, [branch_id, time])
        .then(val => {
            //console.log(val);
            totalReservations = val.rows[0].result;
            console.log("zzz " + totalReservations.valueOf());
        })
        .catch(err => {
            console.error(err);
        });
    return totalReservations;
}

module.exports = { getBranch: getBranch, reserveTimeslot: reserveTimeslot };