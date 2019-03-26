let sqlQueries = {
    visiblePromotions: 'SELECT * FROM Promotions WHERE visibility = TRUE',
    allPromotions: 'SELECT * FROM Promotions WHERE visibility = TRUE',
    getPromotion: 'SELECT * FROM Promotions WHERE id = $1',
    createPromotion: 'INSERT INTO Promotions(name, promo_code, description, start_timeslot, end_timeslot, start_date, end_date, visibility) VALUES($1, $2, $3, $6, $5, $4, $7, $8) returning id',
    createOffers: 'INSERT INTO Offers(branch_id, promo_id) VALUES($1, $2)',
    promoBranches: 'SELECT * FROM Branches b INNER JOIN Restaurants r on b.restaurant_id = r.id WHERE b.id in (SELECT branch_id FROM Offers WHERE promo_id = $1)'
};

module.exports = sqlQueries;
