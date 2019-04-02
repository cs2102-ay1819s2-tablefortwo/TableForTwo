$(function() {
   
    const form = $("#login_form");

    form.validate({
        rules: {
            loginPassword: {
                required: true,
                minlength: 3
            },
            loginName: {
                required: true,
                minlength: 5
            },
            loginUsername: {
                required: true,
                minlength: 5
            }
        },
        messages: { 
            loginName: {
                required: 'Name cannot be empty.'
            },
            loginPassword: {
                required: 'Password cannot be empty.'
            },
            loginUsername: {
                required: 'Username cannot be empty.'
            }
        },
        submitHandler: function (form) {
            form.submit();
        }
    });
});
