$(function() {
    jQuery.validator.addMethod("lengthConstraint", function (value, element) {
        const loginName = $("#loginName").val();
        const loginUsername = $("#loginUsername").val();
        const loginPassword = $("#loginPassword").val();

        return length(loginName) > 3 && length(loginUsername) > 3 && length(loginPassword) > 3;
    }, "Length of name, username, password must be > 3.");
    
    const form = $("#login_form");

    form.validate({
        rules: {
            loginPassword: {
                required: true,
                lengthConstraint: true
            },
            name: {
                required: true,
                lengthConstraint: true
            },
            loginUsername: {
                required: true,
                lengthConstraint: true
            }
        },
        messages: { 
            name: {
                required: 'Name cannot be empty.'
            },
            loginPassword: {
                required: 'Password cannot be empty.'
            },
            loginUsername: {
                required: 'Username cannot be empty.'
            }
        },
    });
});
