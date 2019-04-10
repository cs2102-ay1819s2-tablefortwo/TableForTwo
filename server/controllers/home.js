'use strict';
const passport = require('passport');
const db = require('../../server/helpers/database').db;
const promoQuery = require('../../sqlQueries/promotions');
const branchQuery = require('../../sqlQueries/branches');
const trendingBranchesQuery = require('../../sqlQueries/branches');

let index = (req, res) => {
    let apiCalls = [];

    if (req.user && req.user.role === 'ADMIN') {
        apiCalls.push(db.query(promoQuery.allPromotions));
    } else {
        apiCalls.push(db.query(promoQuery.nonExclusivePromotions));
    }

    apiCalls.push(db.query(trendingBranchesQuery.trendingBranches));
    if (req.user) {
        apiCalls.push(db.query(branchQuery.recommendedBranches, [req.user.id]));
    }

    Promise.all(apiCalls)
        .then(response => {
            const promotions = parsePromotions(response[0]);
            const trendingBranches = parseTrendingBranches(response[1]);
            const recommendedBranches = response[2] ? response[2].rows : null;

            return res.render('home', { layout: 'index', title: 'Home', promotions: promotions, recommendedBranches: recommendedBranches, trendingBranches: trendingBranches });
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
            res.redirect('back');
        }

        req.login(user, loginErr => {
            if (loginErr) {
                req.flash('error', 'Invalid login');
                return next(loginErr);
            }
            return res.redirect('back');
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

let parseTrendingBranches = (response) => {
    let branches = [];
    for (let i = 0; i < response.rowCount; i++) {
        let row = response.rows[i];
        branches.push(row);
    }

    return branches;
}

module.exports = { index: index, handleLoginValidation: handleLoginValidation };
