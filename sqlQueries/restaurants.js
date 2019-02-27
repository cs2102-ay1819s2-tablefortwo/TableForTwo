let sqlQueries = {
	allRestaurants: 'SELECT * FROM Restaurants',
	allRestaurantsAndBranches: 'select * from branches left join (select * from restaurants inner join owns on restaurants.id = owns.restaurant_id)t_CTE on branches.id = t_CTE.branch_id;',
    getAssocBranches: 'select * from branches where id in (select branch_id from owns where restaurant_id = $1);'
};

module.exports = sqlQueries;