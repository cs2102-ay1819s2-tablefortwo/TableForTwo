let sqlQueries = {
	allRestaurants: 'SELECT * FROM Restaurants',
	allRestaurantsAndBranches: 'SELECT r.id restaurant_id, r.rname, r.rphone, r.raddress, b.id branch_id, b.bname, b.bphone, b.baddress, b.barea, b.openinghour FROM Restaurants r INNER JOIN Branches b on r.id = b.restaurant_id;',
    getBranchMenuItems: 'select * from branches right join sells on branches.id = sells.bid right join menuitems on menuitems.id = sells.mid where branches.id = $1;',
    getTimeslots: 'SELECT * FROM Timeslot WHERE branch_id = $1;',
    makeReservation: 'INSERT INTO Reservations (customer_id, branch_id, pax, reservedSlot) VALUES ($1, $2, $3, $4);',
    getReservations: 'SELECT reservedSlot, coalesce(sum(pax), 0) AS paxBooked FROM Reservations WHERE branch_id = $1 GROUP BY reservedSlot;',
};

module.exports = sqlQueries;
