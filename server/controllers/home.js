'use strict';

const passport = require('passport');
const db = require('../../server/helpers/database').db;
const sqlQuery = require('../../sqlQueries/promotions');


let index = (req, res) => {
    Promise.all([db.query(sqlQuery.visiblePromotions)])
        .then(response => {
            const promotions = parsePromotions(response[0]);
            return res.render('home', { layout: 'index', title: 'Home', promotions: promotions });
        }).catch(error => {
            console.log(error);
    });
};

    let handleLoginValidation = (req, res, next) => {
    console.log('Handling login validation' + req.body.name);
    passport.authenticate('local-login', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (!user) {
            res.redirect('./');
        }

        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }
            return res.redirect('/');
        });
    })(req, res, next);
};


let parsePromotions = (promoResponse) => {
    let promotions = [];
    for (let i = 0; i < promoResponse.rowCount; i++) {
        let row = promoResponse.rows[i];
        promotions.push(row);
    }
    return promotions;
};

let reserveTimeslot = (req, res) => branchController.reserveTimeslot(req, res);

module.exports = { index: index, handleLoginValidation: handleLoginValidation, reserveTimeslot: reserveTimeslot };
