'use strict';
const db = require('../helpers/database').db;
const manageQueries = require('../../sqlQueries/manage');

let getOverview = (req, res) => {
    if (!req.user || req.user.role !== 'BRANCH_OWNER') {
        req.flash('error', 'You are not allowed to do this');
        res.redirect('/home');
    }
    let userid = req.user.id;
    let restaurantObject = {};

    db.query(manageQueries.getOwnedBranches, [userid])
        .then(val => {
            let branches = val.rows;
            const rname = branches[0].rname;
            const rimage = encodeURI('/images/' + rname + '.jpg');

            for (let j = 0; j < val.rowCount; j++){
                let branchObject = {};
                branchObject['id'] = branches[j].id;
                branchObject['name'] = branches[j].bname;
                branchObject['allSlots'] = [];
                restaurantObject[branches[j].id] = branchObject;
            }

            db.query(manageQueries.getBranchesAndTimeslots, [userid])
                .then(val2 => {
                    let branchTimeslots = val2.rows;
                    for (let i = 0; i < val2.rowCount; i++) {
                        let slot = branchTimeslots[i];
                        restaurantObject[slot.id].allSlots.push(slot);
                    }
                    res.render('manage', { rimage: rimage, sells: [], restaurantObject: restaurantObject });
                }).catch(err => {
                    console.error(err);
                });
        }).catch(err => {
            console.error(err);
        });
}

let deleteSlot = (req, res) => {
    if (!req.user || req.user.role !== 'BRANCH_OWNER') {
        req.flash('error', 'You are not allowed to do this');
        res.redirect('/home');
    }

    console.log("Deleting slot: " + JSON.stringify(req.body));
    let slotToDelete = [];
    slotToDelete.push(req.body.branchid);
    slotToDelete.push(req.body.slotdate);
    slotToDelete.push(req.body.slottime);
    
    db.query(manageQueries.deleteTimeslot, slotToDelete)
        .then(() => {
            req.flash('success', `Timeslot on '${req.body.slotdate}' at '${req.body.slottime}' has been removed!`);
            res.redirect('back');
        }).catch(error => {
            req.flash('error', `Unable to delete timeslot on '${req.body.slotdate}' at '${req.body.slottime}`);
            req.flash('error', `${error.message}`);
            res.redirect('back');
        });
};


module.exports = { getOverview: getOverview, deleteSlot: deleteSlot };
