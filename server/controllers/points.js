'use strict';
const db = require('../helpers/database').db;
const pointTransactionQuery = require('../../sqlQueries/pointTransaction');
const promotionQuery = require('../../sqlQueries/promotions');

let index = (req, res) => {
    if (!req.user) {
        req.flash('error', 'You need to log in first');
        return res.redirect('/home');
    }

    db.query(pointTransactionQuery.getCustomerTransactions, [req.user.id])
        .then((response) => {
            const transactions = response.rows;
            let totalPoints = 0;
            transactions.forEach(transaction => {
                totalPoints += transaction['point'];
            });
            const queries = [db.query(promotionQuery.promotionsForRedemption, [req.user.id]),
                db.query(promotionQuery.exclusivePromotions, [req.user.id])];
            Promise.all(queries).then(promoResponse => {
                const promoForRedemption = promoResponse[0].rows;
                const exclusivePromotions = promoResponse[1].rows;
                res.render('points', {transactions: transactions, totalPoints: totalPoints,
                    promoForRedemption: promoForRedemption, exclusivePromotions: exclusivePromotions});
            }).catch(err => {
                req.flash('error', err.message);
                res.redirect('/home');
            })
        })
        .catch((err) => {
            req.flash('error', err.message);
            res.redirect('/home');
        });
};

let redeem = (req, res) => {
    if (!req.user) {
        req.flash('error', 'You need to log in first');
        return res.redirect('/home');
    }

    const promoIdToRedeem = req.body['promo_id'];
    const promoCode = req.body['promo_code'];

    db.query(pointTransactionQuery.redeemPromoFromPoints, [req.user.id, promoIdToRedeem])
        .then((response) => {
            req.flash('success', `Redeemed an exclusive promotion, ${promoCode}`);
            res.redirect(`/points`);
        })
        .catch(err => {
            req.flash('error', `Server error: ${err.message}`);
            res.redirect(`/points`);
        });
};

module.exports = { index: index, redeem: redeem };
