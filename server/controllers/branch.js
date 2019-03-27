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

    Promise.all([db.query(branchQueries.getReservations, [bid]),
            db.query(branchQueries.getTimeslots, [bid]),
            db.query(branchQueries.getBranchMenuItems, [bid])])
        .then(response => {
            let branch_reservations = response[0];
            // create object for reservations
            let reservationsObj = {};
            for (let i = 0; i < branch_reservations.rowCount; i++) {
                let row = branch_reservations.rows[i];
                // TODO: DATE
                reservationsObj[row.reserveddate+row.reservedslot] = row.paxbooked;
            }

            let branch_timeslots = response[1];
            // add time slots table for branch
            let timeslots = [];
            for (let i = 0; i < branch_timeslots.rowCount; i++) {
                let row = branch_timeslots.rows[i];
                const currentTimeslot = row.timeslot;
                const currentDateslot = row.dateslot;
                console.log(currentDateslot);
                const paxBooked = reservationsObj[currentDateslot+currentTimeslot] == null ? 0 : reservationsObj[currentDateslot+currentTimeslot];
                let timeslot_data = { dateslot: currentDateslot, timing: currentTimeslot, slots: row.numslots - paxBooked, br_id: row.branch_id };
                timeslots.push(timeslot_data);
            }

            let branch_menuitems = response[2];
            // add menu items
            let foodItems = [];
            for (let i = 0; i < branch_menuitems.rowCount; i++) {
                let row = branch_menuitems.rows[i];
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
    bookingInfo.push(req.body.slotdate);

    db.query(branchQueries.makeReservation, bookingInfo)
        .then(() => {
            console.log("successfully booked ");
            req.flash('success', `Booking on '${req.body.slotdate}' at '${req.body.timing}' has been added!`);
            res.redirect('/home');
        }).catch(error => {
            req.flash('error', `Unable to make reservation on '${req.body.slotdate}' at '${req.body.timing}'`);
            res.redirect('/home');
        });
};

module.exports = { getBranch: getBranch, reserveTimeslot: reserveTimeslot };