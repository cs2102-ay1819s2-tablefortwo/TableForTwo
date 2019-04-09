'use strict';
const db = require('../helpers/database').db;
const reservationQuery = require('../../sqlQueries/reservations');

let viewReservations = (req, res) => {
    if (!req.user) {
        req.flash('error', 'You need to log in first');
        return res.redirect('/home');
    }

    let userid = req.user.id;
    const reservations = [];

    db.query(reservationQuery.getCustomerReservations, [userid])
        .then(val => {
            let rows = val.rows;

            for (let i = 0; i < val.rowCount; i++) {
                reservations.push(rows[i]);
            }
            if (req.user.role === 'BRANCH_OWNER') {
                db.query(reservationQuery.getOwnerUnconfirmedReservations, [userid])
                    .then(val2 => {
                        res.render('reservations', { reservations: reservations, unconfirmedReservations: val2.rows });
                    }).catch(err => {
                        console.error(err);
                })
            } else {
                res.render('reservations', { reservations: reservations });
            }
        })
        .catch(err => {
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
            req.flash('success', `Booking on '${req.body.reservedDate}' at '${req.body.reservedSlot}' has been removed!`);
            res.redirect('/viewReservations');
        }).catch(error => {
        req.flash('error', `Unable to delete reservation on '${req.body.reservedDate}' at '${req.body.reservedSlot}`);
        res.redirect('/viewReservations');
    });
};

module.exports = { viewReservations: viewReservations, confirmReservation: confirmReservation, deleteReservation: deleteReservation };
