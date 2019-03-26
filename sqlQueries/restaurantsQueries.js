let sqlQueries = {
	allRestaurants: 'SELECT * FROM Restaurants',
	allRestaurantsAndBranches: 'select * from branches left join (select * from restaurants inner join owns on restaurants.id = owns.restaurant_id)t_CTE on branches.id = t_CTE.branch_id;',
    getAssocBranches: 'select * from branches where id in (select branch_id from owns where restaurant_id = $1);',
    getBranchMenuItems: 'select * from branches right join sells on branches.id = sells.bid right join menuitems on menuitems.id = sells.mid where branches.id = $1;',
    getTimeslots: 'SELECT * FROM Timeslot WHERE branch_id = $1;',
    makeReservation: 'INSERT INTO Reservations (customer_id, branch_id, pax, reservedSlot) VALUES ($1, $2, $3, $4);',
    countReservations: 'SELECT coalesce(sum(pax), 0) FROM Reservations WHERE reservedSlot = $1 AND branch_id = $2;'
};

module.exports = sqlQueries;