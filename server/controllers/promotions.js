'use strict';
const db = require('../../server/helpers/database').db;
const promoQueries = require('../../sqlQueries/promotions');
const branchesQueries = require('../../sqlQueries/branches');
const moment = require('moment');

let show = (req, res) => {
    db.query(promoQueries.getPromotion, [req.params['promoId']]).then((promo) => {
        db.query(promoQueries.promoBranches, [req.params['promoId']]).then((dbBranches) => {
            const promotion = promo.rows[0];
            const branches = dbBranches.rows;
            const sortedBranches = sortBranchesAccordingToRestaurant(branches);
            return res.render('promotion', {layout: 'index', title: `Promotions | ${promotion.name}`, promotion: promotion, branchesByRestaurant: sortedBranches});
        }).catch(error => {
            req.flash('error', `Server error: ${error}`);
            return res.redirect('../home');
        });
    }).catch(error => {
        req.flash('error', `Server error: ${error}`);
        return res.redirect('../home');
    })
};

let newPromo = (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'ADMIN') {
        req.flash('error', 'Unauthorized access.');
        return res.redirect('/home');
    }

    const form = req.flash('form')[0];
    db.query(branchesQueries.allBranches).then(data => {
        return res.render('new_promotion', {layout: 'index', title: 'New Promotion', branches: data.rows, form: form});
    }).catch(error => {
        req.flash('error', `Server error: ${error}`);
        return res.redirect('../home');
    });
};

let create = (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "ADMIN") {
        req.flash('error', 'You are not allowed to do this');
        return res.redirect('/home');
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
            return res.redirect(`/promotions/${promoId}`);
        }).catch(error => {
            req.flash('error', `${error}`);
            return res.redirect(`/promotions/${promoId}`);
        });
    }).catch(error => {
        req.flash('error', `Server error: ${error}`);
        req.flash('form', {
            ...form,
            applicableBranches: branches.map(branchId => +branchId), // coerce to number
        });
        return res.redirect('/promotions/new');
    });
};

let edit = (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'ADMIN') {
        req.flash('error', 'Unauthorized access.');
        return res.redirect('/home');
    }

    const promoId = req.params['promoId'];
    Promise.all([db.query(promoQueries.getPromotion, [promoId]), db.query(promoQueries.promoBranches, [promoId]),
        db.query(branchesQueries.allBranches)]).then(response => {
            const promotion = response[0].rows[0];
            const branchesUsingPromo = response[1].rows.map(branchUsingPromo => branchUsingPromo.id);
            const allBranches = response[2].rows;
            const form = {
                id: promotion['id'],
                name: promotion['name'],
                promoCode: promotion['promo_code'],
                description: promotion['description'],
                startTime: promotion['start_timeslot'],
                endTime: promotion['end_timeslot'],
                startDate: moment.utc(promotion['start_date']).local().format("YYYY-MM-DDTHH:mm:ss"),
                endDate: moment.utc(promotion['end_date']).local().format("YYYY-MM-DDTHH:mm:ss"),
                promoVisibility: promotion['visibility'],
                applicableBranches: branchesUsingPromo,
            };
            return res.render('edit_promotion', {layout: 'index', title: `Edit Promotion`, branches: allBranches, form: form});
        }).catch(error => {
            req.flash('error', `Server error: ${error}`);
            return res.redirect(`/promotions/${promoId}`);
    });
};

let update = (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'ADMIN') {
        req.flash('error', 'Unauthorized access.');
        return res.redirect('/home');
    }

    const promoId = req.params['promoId'];
    const originalForm = req.body;
    const { applicableBranches, ...form } = originalForm;
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
                    res.redirect(`/promotions/${promoId}/edit`);
                    done();
                })
            }
            return !!trans_err
        };
        client.query('BEGIN;', [], (err) => {
            if (shouldAbort(err)) return;
            client.query(promoQueries.updatePromotion, [form['id'], form['name'], form['description'], form['promoCode'],
                !!form['promoVisibility'], form['startDate'], form['endDate'], form['startTime'], form['endTime']], (err) => {
                if (shouldAbort(err)) return;
                client.query(promoQueries.insertOffers, [promoId, getUpdatedOffers(promoId, applicableBranches)], (err) => {
                    if (shouldAbort(err)) return;
                    client.query(promoQueries.deleteOffers, [promoId, getUpdatedOffers(promoId, applicableBranches)], (err) => {
                        if (shouldAbort(err)) return;
                        client.query('COMMIT;', [], (err) => {
                            if (shouldAbort(err)) return;
                            req.flash('success', 'Promotion updated successfully.');
                            res.redirect(`/promotions/${promoId}`);
                            done();
                        })
                    })
                })
            })
        })
    })
};


function getUpdatedOffers(promoId, applicableBranches) {
    let updatedOffers = [];
    if (Array.isArray(applicableBranches)) {
        updatedOffers = applicableBranches;
    } else {
        updatedOffers.push(applicableBranches);
    }

    return updatedOffers;
}

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

module.exports = { show: show, create: create, new: newPromo, edit: edit, update: update};
