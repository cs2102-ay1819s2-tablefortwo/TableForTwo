'use strict';
const passport = require('passport');
const db = require('../../server/helpers/database').db;
const sqlQuery = require('../../sqlQueries/promotions');


let index = (req, res) => {
    const user = {
        ...req.session.user ? req.session.user[0] : {},
        isLoggedIn: req.isAuthenticated()
    };
    Promise.all([db.query(sqlQuery.allPromotions)])
        .then(response => {
            const promotions = parsePromotions(response[0]);
            return res.render('home', { layout: 'index', title: 'Home', user: user, promotions: promotions });
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
            req.flash('failure', 'invalid login');
            res.locals.message = 'invalid login';
            res.redirect('./');
        }

        req.login(user, loginErr => {
            if (loginErr) {
                next(loginErr);
            }

            res.locals.message = 'successful login';
            res.cookie('user_name', user.nane);
            res.cookie('user_id', user.id);
            return res.redirect('../home');
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

module.exports = { index: index, handleLoginValidation: handleLoginValidation };
