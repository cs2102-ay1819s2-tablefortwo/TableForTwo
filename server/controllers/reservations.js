'use strict';
const db = require('../helpers/database').db;
const reservationQuery = require('../../sqlQueries/reservations');
const moment = require('moment');

// Retrieve all reservations for customers, including possible time slots for chosen branches
let viewReservations = (req, res) => {
    if (!req.user) {
        req.flash('error', 'You need to log in first');
        return res.redirect('/home');
    }

    let userid = req.user.id;

    Promise.all([db.query(reservationQuery.getCustomerReservations, [userid]),
            db.query(reservationQuery.getTimeslotsForReservation, [userid])])
    .then(response => {
        let reservation_rows = response[0];
        const reservations = [];
        for (let i = 0; i < reservation_rows.rowCount; i++) {
            reservations.push(reservation_rows.rows[i]);
        }

        let timeslot_rows = response[1];
        const allTimeslots = [];
        for (let i = 0; i < timeslot_rows.rowCount; i++) {
            allTimeslots.push(timeslot_rows.rows[i]);
        }

        if (req.user.role === 'BRANCH_OWNER') {
            db.query(reservationQuery.getOwnerUnconfirmedReservations, [userid])
                .then(val => {
                    res.render('reservations', { reservations: reservations, allTimeslots: allTimeslots, unconfirmedReservations: val.rows });
                }).catch(err => {
                    console.error(err);
                })
        } else {
            const allTimeslots = [];
            db.query(reservationQuery.getTimeslotsForReservation, [userid])
                .then(val2 => {
                    let rows = val2.rows;
                    for (let i = 0; i < val2.rowCount; i++) {
                        allTimeslots.push(rows[i]);
                    }
                    res.render('reservations', { reservations: reservations, allTimeslots: allTimeslots });
                }).catch(err => {
                    console.error(err);
                })
        }
    }).catch(err => {
        console.error(err);
    });
};

let confirmReservation = (req, res) => {
    if (!req.user || req.user.role !== 'BRANCH_OWNER') {
        req.flash('error', 'You are not allowed to do this');
        res.redirect('/home');
    }

    const reservationId = req.body['reservationId'];
    db.query(reservationQuery.confirmReservation, [reservationId])
        .then((response) => {
            req.flash('success', 'Customer\'s Reservation confirmed.');
            res.redirect(`/viewReservations`);
        }).catch(err => {
            req.flash('error', `Server error: ${err.message}`);
            res.redirect(`/viewReservations`);
        });
};

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

let updateReservation = (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please login to update reservations.');
        return res.redirect('back');
    }

    console.log("Update reservation: " + JSON.stringify(req.body));
    let reservationInfo = [];
    reservationInfo.push(req.body.pax);
    reservationInfo.push(req.body.timeslots);
    reservationInfo.push(req.body.reservationId);
    console.log(reservationInfo);
    var time = moment(req.body.timeslots, ["h:mm A", "H:mm"]).format('LT');

    db.query(reservationQuery.updateReservation, reservationInfo)
        .then(() => {
            req.flash('success', `Booking #${req.body.reservationId} at '${time}' has been updated!`);
            res.redirect('/viewReservations');
        }).catch(error => {
            req.flash('error', `Unable to change reservation #${req.body.reservationId} at '${time}'`);
            req.flash('error', `${error.message}`);
            res.redirect('/viewReservations');
        });
};

module.exports = { viewReservations: viewReservations, confirmReservation: confirmReservation, deleteReservation: deleteReservation, updateReservation: updateReservation };
