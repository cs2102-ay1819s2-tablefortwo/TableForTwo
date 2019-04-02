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
            signUpName: {
                required: true,
                minlength: 3
            },
            signUpUsername: {
                required: true,
                uniqueUidConstraint: true,
                minlength: 5
            },
            signUpPassword: {
                required: true,
                minlength: 5
            }
        },
        messages: {
            signUpName: {
                required: 'Name cannot be empty.'
            },
            signUpPassword: {
                required: 'Password cannot be empty.'
            },
            signUpUsername: {
                required: 'Username cannot be empty.'
            }
        }
    });
});
