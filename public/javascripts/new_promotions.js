$(function() {
    jQuery.validator.addMethod("startTimeConstraint", function(value, element) {
        const endTimeValue = $("#endTime").val();
        return !endTimeValue || (Date.parse("01/01/2019 " + value) < Date.parse("01/01/2019 " + endTimeValue));
    }, "Start time must be before end time.");

    jQuery.validator.addMethod("endTimeConstraint", function(value, element) {
        const startTimeValue = $("#startTime").val();
        return !startTimeValue || (Date.parse("01/01/2019 " + value) > Date.parse("01/01/2019 " + startTimeValue));
    }, "End time must be after start time.");

    jQuery.validator.addMethod("startDateConstraint", function(value, element) {
        const endTimeValue = $("#endDate").val();
        return !endTimeValue || (Date.parse(value) < Date.parse(endTimeValue));
    }, "Start date must be before end date.");

    jQuery.validator.addMethod("endDateConstraint", function(value, element) {
        const startDateValue = $("#startDate").val();
        return !startDateValue || (Date.parse(value) > Date.parse(startDateValue));
    }, "End date must be after start date.");

    const form = $("#new_promotion_form");

    form.validate({
        rules: {
            name: {
                required: true
            },
            promoCode: {
                required: true
            },
            description: {
                required: true
            },
            startTime: {
                required: true,
                startTimeConstraint: true,
            },
            endTime: {
                required: true,
                endTimeConstraint: true,
            },
            startDate: {
                required: true,
                startDateConstraint: true,
            },
            endDate: {
                required: true,
                endDateConstraint: true,
            },

        },
        messages: {
            name: {
                required: 'Promotion name cannot be empty.'
            },
            promoCode: {
                required: 'Promotional code cannot be empty.'
            },
            description: {
                required: 'Description cannot be empty.'
            },
            startTime: {
                required: 'Start time cannot be empty.'
            },
            endTime: {
                required: 'End time cannot be empty.'
            },
            startDate: {
                required: 'Start date name cannot be empty.'
            },
            endDate: {
                required: 'End date cannot be empty.'
            },
        },
    });
});
