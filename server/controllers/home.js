'use strict';
const db = require('../../server/database');
const path = require('path');

let index = (req, res) => {
    res.render('index', { layout: 'index', title: 'Home' });
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


function selectAllRecords() {
    
}

let dataView = (req, res) => {
    let selectQuery = 'select * from student_info;';
    db.db.query(selectQuery, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Row count of data: ' + JSON.stringify(data.rows[0]));
            
            res.render('index', { layout: 'dataView', data: data.rows });
        }
    });
};

module.exports = { index: index, data: data, dataView: dataView };