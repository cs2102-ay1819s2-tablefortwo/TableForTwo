'use strict';
const db = require('../../server/helpers/database').db;
const branchQueries = require('../../sqlQueries/restaurantsQueries');
const promotionQueries = require('../../sqlQueries/promotions');
const ratingsQueries = require('../../sqlQueries/ratings');
const moment = require('moment');

let getBranch = (req, res) => {
    let rid = req.params.restaurant_id;
    let bid = req.params.branch_id;    

    Promise.all([db.query(branchQueries.getBranchDetails, [bid]),
            db.query(branchQueries.getReservations, [bid]),
            db.query(branchQueries.getTimeslots, [bid]),
            db.query(branchQueries.getBranchMenuItems, [bid]),
            db.query(ratingsQueries.getAvgBranchRating, [bid]),
            db.query(ratingsQueries.getRatingsForBranch, [bid])])
        .then(response => {
            // get and restaurant details
            let branch_details = response[0].rows[0];
            console.log('Displaying details for branch');
            console.log(JSON.stringify(branch_details));
            let rname = branch_details.rname;
            let rimage = encodeURI('/images/' + rname + '.jpg');
            let bname = branch_details.bname;
            let baddress = branch_details.baddress;
            let bphone = branch_details.bphone;        

            let branch_reservations = response[1];
            // create object for reservations
            let reservationsObj = {};
            for (let i = 0; i < branch_reservations.rowCount; i++) {
                let row = branch_reservations.rows[i];
                // TODO: DATE
                reservationsObj[row.reserveddate+row.reservedslot] = row.paxbooked;
            }

            let branch_timeslots = response[2];
            // add time slots table for branch
            let timeslots = [];
            for (let i = 0; i < branch_timeslots.rowCount; i++) {
                let row = branch_timeslots.rows[i];
                const currentTimeslot = row.timeslot;
                const currentDateslot = row.dateslot;
                const paxBooked = reservationsObj[currentDateslot+currentTimeslot] == null ? 0 : reservationsObj[currentDateslot+currentTimeslot];
                let timeslot_data = { dateslot: currentDateslot, timing: currentTimeslot, slots: row.numslots - paxBooked, br_id: row.branch_id };
                timeslots.push(timeslot_data);
            }

            let branch_menuitems = response[3];
            // add menu items
            let foodItems = [];
            for (let i = 0; i < branch_menuitems.rowCount; i++) {
                let row = branch_menuitems.rows[i];
                let food = { name: row.name, price: row.price };
                foodItems.push(food);
            }

            // get summary of rating for branch
            let avgRating = response[4].rows[0].rating;
            avgRating = Math.trunc(avgRating);

            // verbose version of ratings
            let ratingsDetails = response[5];
            let allRatings = [];
            for (let i = 0; i < ratingsQueries.rowCount; i++) {
                let row = ratingsDetails.rows[i];
                let ratingInfo = { rating: row.rating, comments: row.comments, cid: row.customer_id };
                allRatings.push(ratingInfo);
            }

            res.render('branch', { rimage: rimage, bname: bname, baddress: baddress, bphone: bphone, timeslots: timeslots, sells: foodItems, avgRating: avgRating, allRatings: allRatings });
        })
        .catch(err => {
            console.error(err);
        });
};

let addRating = (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please login to rate.');
        return res.redirect('back');
    }

    let cid = req.user.id;
    let rating = req.body.rating;
    let comments = req.body.comments;
    let bid = req.locals.bid;

    console.log('Adding rating');

    db.query(ratingsQueries.addRating, [rating, comments, cid, bid])
        .then(res => {

        })
        .catch(err => console.error(err));

}

let reserveTimeslot = (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please login to make reservations.');
        return res.redirect('back');
    }

    console.log('Reserving timeslot');
    console.log(JSON.stringify(req.body));

    var time = moment(req.body.timing, ["h:mm A", "H:mm"]).format('LT');
    const promoCode = req.body.promoCode.trim();

    let bookingInfo = [];
    bookingInfo.push(req.user.id);
    bookingInfo.push(req.body.bid);
    bookingInfo.push(req.body.pax);
    bookingInfo.push(req.body.timing);
    bookingInfo.push(req.body.slotdate);
    bookingInfo.push(promoCode);

    new Promise((resolve, reject) => {
        if (promoCode !== '') {
            db.query(promotionQueries.getPromotionByCode, [promoCode])
                .then((response) => {
                    if (response.rows.length === 0) {
                        reject(`No such promotion \'${promoCode}\'`);
                    } else {
                        resolve();
                    }
                })
        } else {
            resolve();
        }
    }).then(success => {
        db.query(branchQueries.makeReservation, bookingInfo)
            .then(() => {
                console.log("successfully booked ");
                req.flash('success', `Booking on '${req.body.slotdate}' at '${time}' has been added!`);
                res.redirect(`/restaurants/${req.params.restaurant_id}/branches/${req.params.branch_id}`);
            }).catch(error => {
            req.flash('error', `Unable to make reservation on '${req.body.slotdate}' at '${time}`);
            req.flash('error', `${error.message}`);
            res.redirect(`/restaurants/${req.params.restaurant_id}/branches/${req.params.branch_id}`);
        });
    }).catch(error => {
        req.flash('error', `${error}`);
        res.redirect(`/restaurants/${req.params.restaurant_id}/branches/${req.params.branch_id}`);
    })
};

module.exports = { getBranch: getBranch, reserveTimeslot: reserveTimeslot };
