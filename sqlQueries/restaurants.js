let sqlQueries = {
	allRestaurants: 'SELECT * FROM Restaurants',
	allRestaurantsAndBranches: 'SELECT * FROM Restaurants r INNER JOIN Branches b on r.id = b.restaurant_id;',
    getBranchMenuItems: 'select * from branches right join sells on branches.id = sells.bid right join menuitems on menuitems.id = sells.mid where branches.id = $1;'
};

module.exports = sqlQueries;
