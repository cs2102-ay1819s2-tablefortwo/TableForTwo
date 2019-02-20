'use strict';
const db = require('../../server/database');

let index = (req, res) => {
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
    let insertQuery = db.generateInsertQuery(newRecord);
    // Insert into db
    db.insertIntoDatabase(insertQuery);

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