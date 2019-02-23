'use strict';
const passport = require('passport');

let index = (req, res) => {
    res.render('signup', { layout: 'index', title: 'signup', message: res.locals.message });
};

let handleSignup = (req, res, next) => {
    console.log('Handling signup ' + req.body.name);
    passport.authenticate('local-signup', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (!user) {
            req.flash('failure', 'invalid signup');
            res.locals.message = 'invalid signup';
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

module.exports = { index: index, handleSignup: handleSignup };