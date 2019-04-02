const db = require('../../server/helpers/database').db;
const sqlQuery = require('../../sqlQueries/users');



function check(event) {
    // Get Values
    var name = document.getElementById('signUpName').value;
    var username = document.getElementById('signUpUsername').value;
    var password = document.getElementById('signUpPassword').value;

    // Simple Check
    if (name.length == 0 || username.length == 0 || password.length == 0) {
        alert("All fields cannot be empty");
        event.preventDefault();
        event.stopPropagation();
        return false;
    } 

    db.query(sqlQuery.findByUsername, [username])
        .then(res => {
            if (res.rowCount > 0) { // username already exists in db
                alert("Username taken");
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        })
        .catch(err => {
            console.error(err);
        });
}
