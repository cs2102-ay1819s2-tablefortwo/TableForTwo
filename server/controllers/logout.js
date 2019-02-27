'use strict';

let index = (req, res) => {
    if (req.isAuthenticated()) {
        req.logout();
        return req.redirect('/');
    }
    console.log('user not currently logged in');
};

module.exports = index;