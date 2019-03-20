'use strict';



let index = (req, res) => {
    const timeslots = [
        {timing: '10AM', slotsLeft: 10},
        {timing: '11AM', slotsLeft: 5},
        {timing: '12PM', slotsLeft: 7}
    ]

    if (req.isAuthenticated()) {
        const user = {
            id: req.session.passport.user,
            isloggedin: req.isAuthenticated()
        };
        let userDetails = user.id[0];
        return res.render('restaurantPage', { layout: 'index', title: 'Pizza Hut', image: 'images/pizzaHutHeader.jpg', timeslots: timeslots, user: userDetails, isLoggedIn: user.isloggedin });
    } else {
        return res.render('restaurantPage', { layout: 'index', title: 'Pizza Hut', image: 'images/pizzaHutHeader.jpg', timeslots: timeslots, isLoggedIn: req.isAuthenticated() });
    }
};

module.exports = { index: index };
