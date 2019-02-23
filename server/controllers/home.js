'use strict';
const db = require('../../server/helpers/database').db;
const userSqlQuery = require('../../sqlQueries/users');

let index = (req, res) => {
    if (req.isAuthenticated()) {
        let user = {
            id: req.session.passport.user,
            isloggedin: req.isAuthenticated()
        };
        return res.render('home', { layout: 'index', title: 'Home', user: user });
    }
    res.render('home', { layout: 'index', title: 'Home' });
};

let data = (req, res) => {
    // Validation already performed
    let newRecord = {
        matric: req.body.matric,
        name: req.body.name,
        faculty: req.body.faculty
    };

    // Forumlate query
    //let insertQuery = db.query(userSqlQuery.signupUser, []);
    // Insert into db
    //db.insertIntoDatabase(insertQuery);

    res.redirect('/home/data');
};

let dataView = (req, res) => {
    let selectQuery = 'select * from student_info;';
    db.db.query(selectQuery, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Row count of data: ' + JSON.stringify(data.rows[0]));
            
            res.render('dataView', { layout: 'index', data: data.rows });
        }
    });
};

module.exports = { index: index, data: data, dataView: dataView };