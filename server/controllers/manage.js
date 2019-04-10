'use strict';
const db = require('../helpers/database').db;
const moment = require('moment');

let getOverview = (req, res) => {
    res.send(200);
}

let deleteReservation = (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please login to delete reservations.');
        return res.redirect('back');
    }

    console.log("Deleting reservation: " + JSON.stringify(req.body));

    db.query(reservationQuery.deleteReservation, [req.body.reservationId])
        .then(() => {
            req.flash('success', `Booking #${req.body.reservationId} on '${req.body.reservedDate}' at '${req.body.reservedSlot}' has been removed!`);
            res.redirect('/viewReservations');
        }).catch(error => {
            req.flash('error', `Unable to delete reservation #${req.body.reservationId} on '${req.body.reservedDate}' at '${req.body.reservedSlot}`);
            res.redirect('/viewReservations');
        });
};


module.exports = { getOverview: getOverview, deleteReservation: deleteReservation };
