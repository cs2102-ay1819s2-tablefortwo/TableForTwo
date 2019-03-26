'use strict';
const db = require('../../server/helpers/database').db;
const promoQueries = require('../../sqlQueries/promotions');
const branchesQueries = require('../../sqlQueries/branches');

let show = (req, res) => {
    db.query(promoQueries.getPromotion, [req.params['promoId']]).then((promo) => {
        db.query(promoQueries.promoBranches, [req.params['promoId']]).then((dbBranches) => {
            const promotion = promo.rows[0];
            const branches = dbBranches.rows;
            const sortedBranches = sortBranchesAccordingToRestaurant(branches);
            return res.render('promotion', {layout: 'index', title: `Promotions | ${promotion.name}`, promotion: promotion, branchesByRestaurant: sortedBranches});
        }).catch(error => {
            req.flash('error', `Server error: ${error}`);
            res.redirect('../home');
        });
    }).catch(error => {
        req.flash('error', `Server error: ${error}`);
        res.redirect('../home');
    })
};

let newPromo = (req, res) => {
    const form = req.flash('form')[0];
    if (req.isAuthenticated() && req.user.role === "ADMIN") {
        db.query(branchesQueries.allBranches).then(data => {
            return res.render('new_promotion', {layout: 'index', title: 'New Promotion', branches: data.rows, form: form});
        }).catch(error => {
            req.flash('error', `Server error: ${error}`);
            res.redirect('../home');
        });
    } else {
        req.flash('error', 'Unauthorized access.');
        return res.redirect('../home');
    }
};

let create = (req, res) => {
    if (!req.isAuthenticated() && req.user.role === "ADMIN") {
        req.flash('error', 'You are not allowed to do this');
        res.redirect('../home');
        return;
    }

    const originalForm = req.body;
    let { applicableBranches, ...form } = originalForm;

    let branches = [];
    if (Array.isArray(applicableBranches)) {
        branches = applicableBranches;
    } else {
        branches.push(applicableBranches);
    }

    form = {
        ...form,
        promoVisibility: !!form['promoVisibility'],
    };

    db.query(promoQueries.createPromotion, Object.values(form)).then((promo) => {
        const promoId = promo.rows[0].id;
        const apiCalls = [];
        for (const branch of branches) {
            apiCalls.push([db.query(promoQueries.createOffers, [branch, promoId])]);
        }
        Promise.all(apiCalls).then(success => {
            req.flash('success', `Promotion '${form['promoCode']}' has been added!`);
            res.redirect(`/promotions/${promoId}`);
        }).catch(error => {
            req.flash('error', `${error}`);
            res.redirect(`/promotions/${promoId}`);
        });
    }).catch(error => {
        console.log(branches);
        req.flash('error', `Server error: ${error}`);
        req.flash('form', {
            ...form,
            applicableBranches: branches.map(branchId => +branchId), // coerce to number
        });
        res.redirect('/promotions/new');
    });
};

let edit = (req, res) => {
    const promoId = req.params['promoId'];
    return res.render('edit_promotion', {layout: 'index', title: `Edit Promotion`});
};

/**
 * returns a nested array. The nested array will contain all the branches belonging to the same restaurant.
 */
function sortBranchesAccordingToRestaurant(branches) {
    let result = {};
    for (const branch of branches) {
        if (!Array.isArray(result[branch['restaurant_id']])) {
            result[branch['restaurant_id']] = [];
        }
        result[branch['restaurant_id']].push(branch);
    }
    return Object.values(result);
}

module.exports = { show: show, create: create, new: newPromo, edit: edit };
