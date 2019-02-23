const db = require('../helpers/database').db;
const sqlQueries = require('../../sqlQueries/users');

function findById(id) {
    return db.query(sqlQueries.findById, [id])
        .then(res => {
            if (res.rowCount > 0) {
                return res.rows;
            }
            return null;
        });
};

function findByUsername(username) {
    return db.query(sqlQueries.findByUsername, [username])
        .then(res => {
            if (res.rowCount > 0) {
                return res.rows;
            }
            return null;
        });
};

module.exports = { findById: findById, findByUsername: findByUsername };