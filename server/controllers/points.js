'use strict';
const db = require('../helpers/database').db;
const pointTransactionQuery = require('../../sqlQueries/pointTransaction');
const promotionQuery = require('../../sqlQueries/promotions');

let index = (req, res) => {
    if (!req.user) {
        req.flash('error', 'You need to log in first');
        return res.redirect('/home');
    }

    db.query(pointTransactionQuery.getCustomerTransaction, [req.user.id])
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
    const redemptionCost = req.body['redemption_cost'];

    db.connect((err, client, done) => {
        const shouldAbort = (trans_err) => {
            if (trans_err) {
                console.error('Error in transaction', trans_err.stack);
                client.query('ROLLBACK', (err) => {
                    if (err) {
                        console.error('Error rolling back client', err.stack);
                    }
                    // release the client back to the pool
                    req.flash('error', `Server error: ${trans_err.message}`);
                    res.redirect(`/points`);
                    done();
                })
            }
            return !!trans_err
        };
        client.query('BEGIN;', [], (err) => {
            if (shouldAbort(err)) return;
            client.query(pointTransactionQuery.redeemPromoFromPoints, [req.user.id, promoIdToRedeem], err => {
                if (shouldAbort(err)) return;
                client.query(pointTransactionQuery.insertPointTransaction,
                    [null, req.user.id, -1 * redemptionCost, `Redeemed an exclusive promotion, ${promoCode}.`], err => {
                    if (shouldAbort(err)) return;
                    client.query('COMMIT;', [], (err) => {
                        if (shouldAbort(err)) return;
                        req.flash('success', `Redeemed an exclusive promotion, ${promoCode}`);
                        res.redirect(`/points`);
                        done();
                    })
                })
            })
        });
    })



};

module.exports = { index: index, redeem: redeem };
