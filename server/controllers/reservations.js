'use strict';
const db = require('../helpers/database').db;
const reservationQuery = require('../../sqlQueries/reservations');

let viewReservations = (req, res) => {
    let userid = req.user.id;
    let reservations = [];
    console.log('Retrieving all reservations for user: ' + userid);
    db.query(reservationQuery.getCustomerReservations, [userid])
        .then(val => {
            if (!val || val.rowCount == 0) return;
            let rows = val.rows;

            for (let i = 0; i < val.rowCount; i++) {
                reservations.push(rows[i]);
            }
            console.log(JSON.stringify(reservations));
            res.render('reservations', { reservations: reservations });
        })
        .catch(err => {
            console.error(err);
        });
};

module.exports = { viewReservations: viewReservations };