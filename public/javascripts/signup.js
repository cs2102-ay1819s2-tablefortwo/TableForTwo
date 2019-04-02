const db = require('../../server/helpers/database').db;
const sqlQuery = require('../../sqlQueries/users');

$(function () {

    const form = $("#signup_form");

    jQuery.validator.addMethod("uniqueUidConstraint", function (value, element) {
        const username = $('#signupUsername').value();
        db.query(sqlQuery.findByUsername, [username])
            .then(res => {
                if (res.rowCount > 0) { // username already exists in db
                    alert("Username taken");
                    return false;
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, "Username taken");
    

    form.validate({
        rules: {
            signupName: {
                required: true,
                minlength: 3
            },
            signupUsername: {
                required: true,
                uniqueUidConstraint: true,
                minlength: 5
            },
            signupPassword: {
                required: true,
                minlength: 5
            }
        },
        messages: {
            signupName: {
                required: 'Name cannot be empty.'
            },
            signupPassword: {
                required: 'Password cannot be empty.'
            },
            signupUsername: {
                required: 'Username cannot be empty.'
            }
        }
    });
});
