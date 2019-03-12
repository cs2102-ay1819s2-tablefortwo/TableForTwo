'use strict';
const passport = require('passport');

let index = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('../home');
    }
    res.render('login', { layout: 'index', title: 'login', message: res.locals.message });
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

module.exports = { index: index, handleLoginValidation: handleLoginValidation };