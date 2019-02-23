const db = require('../../server/helpers/database').db;
const user = require('../../server/models/user');

function check(event) {
    // Get Values
    var name = document.getElementById('name').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Simple Check
    if (name.length == 0 || username.length == 0 || password.length == 0) {
        alert("All fields cannot be empty");
        event.preventDefault();
        event.stopPropagation();
        return false;
    } 

    let usersMatchingUsername = user.findByUsername(username);

    if (usersMatchingUsername.length >= 1) {
        alert("Username taken");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}