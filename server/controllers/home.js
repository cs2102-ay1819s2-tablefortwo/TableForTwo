'use strict';
const db = require('../../server/helpers/database').db;

let index = (req, res) => {
    if (req.isAuthenticated()) {
        let user = {
            id: req.session.passport.user,
            isloggedin: req.isAuthenticated()
        };

        let userDetails = user.id[0];
        return res.render('home', { layout: 'index', title: 'Home', user: userDetails });
    }
    //return res.redirect('../login');
};

let data = (req, res) => {
    //if (!req.isAuthenticated()) {
    //    return res.redirect('../login'); 
    //}
    // insert data into sample table
    let newRecord = {
        matric: req.body.matric,
        name: req.body.name,
        faculty: req.body.faculty
    };

    db.query("INSERT INTO student_info(matric, name, faculty) VALUES($1, $2, $3)",
        [newRecord.matric, newRecord.name, newRecord.faculty])
        .then(res.redirect('/home/data'))
        .catch(err => {
            console.error(err);
            next(err);
        });
};

module.exports = { index: index, data: data };
