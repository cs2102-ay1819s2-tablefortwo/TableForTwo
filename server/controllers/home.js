'use strict';
const db = require('../../server/helpers/database');

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
    let insertQuery = generateInsertQuery(newRecord);
    // Insert into db
    db.insertIntoDatabase(insertQuery);

    res.redirect('/home/data');
};

function generateInsertQuery(record) {
    let sql_query = 'INSERT INTO student_info VALUES';
    sql_query += '(\'' + record.matric + '\', \'' + record.name + '\', \'' + record.faculty + '\');';
    return sql_query;
}

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