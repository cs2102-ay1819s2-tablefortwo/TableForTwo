'use strict';
const { Pool } = require('pg');
const db = new Pool({ connectionString: process.env.DATABASE_URL });

function insertIntoDatabase(insertQuery) {
    db.query(insertQuery, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return data;
        }
    });
}

module.exports = { db: db, insertIntoDatabase: insertIntoDatabase };