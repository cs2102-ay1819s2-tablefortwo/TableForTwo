$(document).ready(() => {
    $('.edit').click(function () {
        console.log("Editing reservation: " + this.id);
        
        const timings = retrieveRelevantTimeslots(this.id);
        console.log(timings);

        let timeslot = "#timeslots" + this.id;
        var $timeslots = $(timeslot);
        $timeslots.empty(); // remove old options
        $.each(timings, function (key, value) {
            $timeslots.append($("<option></option>")
                .attr("value", value).text(key.substring(0, key.length - 3)));
        });
    })
});

function retrieveRelevantTimeslots(id) {
    const $allTimeslots = $('#allTimeslots').html();
    const jsonTimeslot = JSON.parse($allTimeslots);
    const timings = {};
    
    for (var i = 0; i < jsonTimeslot.length; i++) {     
        let currSlots = jsonTimeslot[i];   
        if (currSlots.id == id) {
            timings[currSlots.timeslot] = currSlots.timeslot;
        }
    }
    return timings;
}