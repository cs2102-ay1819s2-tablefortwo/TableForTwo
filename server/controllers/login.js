'use strict';
const passport = require('passport');

let index = (req, res) => {
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
            res.locals.message = req.flash();
            res.redirect('./');
        }

        req.login(user, loginErr => {
            if (loginErr) {
                next(loginErr);
            }
            
            res.cookie('user_name', user.nane);
            res.cookie('user_id', user.id);
            return res.json(true);
        });
    })(req, res, next);
};

module.exports = { index: index, handleLoginValidation: handleLoginValidation };