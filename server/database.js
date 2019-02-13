'use strict';
const { Pool } = require('pg');
const db = new Pool({ connectionString: process.env.DATABASE_URL });

function generateInsertQuery(record) {
    let sql_query = 'INSERT INTO student_info VALUES';
    sql_query += '(\'' + record.matric + '\', \'' + record.name + '\', \'' + record.faculty + '\');';
    console.log(sql_query);
    return sql_query;
}

function insertIntoDatabase(insertQuery) {
    db.query(insertQuery, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return data;
        }
    });
}

module.exports = { db: db, generateInsertQuery: generateInsertQuery, insertIntoDatabase: insertIntoDatabase };