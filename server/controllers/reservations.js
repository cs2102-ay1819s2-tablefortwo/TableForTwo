'use strict';
const db = require('../helpers/database').db;
const reservationQuery = require('../../sqlQueries/reservations');
const pointTransactionQuery = require('../../sqlQueries/pointTransaction');

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
    db.connect((err, client, done) => {
        const shouldAbort = (trans_err) => {
            if (trans_err) {
                console.error('Error in transaction', trans_err.stack);
                client.query('ROLLBACK', (err) => {
                    if (err) {
                        console.error('Error rolling back client', err.stack);
                    }
                    // release the client back to the pool
                    req.flash('error', `Server error: ${trans_err.message}`);
                    res.redirect(`/viewReservations`);
                    done();
                })
            }
            return !!trans_err
        };
        client.query('BEGIN;', [], (err) => {
            if (shouldAbort(err)) return;
            client.query(reservationQuery.confirmReservation, [reservationId], (err, response) => {
                if (shouldAbort(err)) return;
                const reservation = response.rows[0];
                client.query(pointTransactionQuery.insertPointTransaction,
                    [reservation['id'], reservation['customer_id'], 1, `A completed reservation 
                    at ${req.body['BranchName']} on ${req.body['reservedDate']}, ${req.body['reservedSlot']}.`], err => {

                    if (shouldAbort(err)) return;
                    client.query('COMMIT;', [], (err) => {
                        if (shouldAbort(err)) return;
                        req.flash('success', 'Customer\'s Reservation confirmed.');
                        res.redirect(`/viewReservations`);
                        done();
                    })
                });
            });
        })
    });
};

module.exports = { viewReservations: viewReservations, confirmReservation: confirmReservation };
