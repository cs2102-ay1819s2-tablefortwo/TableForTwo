'use strict';
const db = require('../../server/helpers/database').db;
const sqlQuery = require('../../sqlQueries/promotions');

let newPromo = (req, res) => {
    const form = req.flash('form')[0];
    if (req.isAuthenticated()) {// TODO: Add require admin condition
        return res.render('new_promotion', {layout: 'index', title: 'New Promotion', form: form});
    } else {
        req.flash('error', 'Unauthorized access.');
        return res.redirect('../home');
    }
};

let create = (req, res) => {
    if (!req.isAuthenticated()) {// TODO: add require admin condition
        req.flash('error', 'You are not allowed to do this');
        res.redirect('../home');
        return;
    }

    let form = req.body;
    form = {
        ...form,
        promoVisibility: !!form['promoVisibility'],
    };

    db.query(sqlQuery.createPromotion, Object.values(form)).then(() => {
        req.flash('success', `Promotion '${form['promoCode']}' has been added!`);
        res.redirect('../home');
    }).catch(error => {
        req.flash('error', `Server error: ${error}`);
        req.flash('form', form);
        res.redirect('/promotions/new');
    });
};

module.exports = { create: create, new: newPromo };
