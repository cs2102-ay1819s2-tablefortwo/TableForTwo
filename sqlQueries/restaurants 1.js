let sqlQueries = {
	allRestaurants: 'SELECT * FROM Restaurants',
	allRestaurantsAndBranches: 'select * from branches left join (select * from restaurants inner join owns on restaurants.id = owns.restaurant_id)t_CTE on branches.id = t_CTE.branch_id;',
};

module.exports = sqlQueries;