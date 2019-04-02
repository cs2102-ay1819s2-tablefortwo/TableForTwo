let sqlQueries = {
    visiblePromotions: 'SELECT * FROM Promotions WHERE visibility = TRUE',
    allPromotions: 'SELECT * FROM Promotions',
    getPromotion: 'SELECT * FROM Promotions WHERE id = $1',
    getPromotionByCode: 'SELECT * FROM Promotions where promo_code = $1',
    createPromotion: 'INSERT INTO Promotions(name, promo_code, description, start_timeslot, end_timeslot, start_date, end_date, visibility) VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning id',
    createOffers: 'INSERT INTO Offers(branch_id, promo_id) VALUES($1, $2)',
    promoBranches: 'SELECT * FROM Branches b INNER JOIN Restaurants r on b.restaurant_id = r.id WHERE b.id in (SELECT branch_id FROM Offers WHERE promo_id = $1)',
    updatePromotion: 'UPDATE Promotions SET name = $2, description = $3, promo_code = $4, visibility = $5, start_date = $6, end_date = $7, start_timeslot = $8, end_timeslot = $9 WHERE id = $1',
    insertOffersFromPromoUpdate: 'INSERT INTO Offers(branch_id, promo_id) ' +
        'SELECT a as branch_id, $1 as promo_id from UNNEST($2::int[]) a WHERE NOT EXISTS( ' +
        '  SELECT 1 ' +
        '  FROM Offers o ' +
        '  WHERE o.branch_id = a AND o.promo_id = $1' +
        '); ',
    deleteOffersFromPromoUpdate: 'DELETE FROM Offers ' +
        'WHERE promo_id = $1 AND branch_id NOT IN ( ' +
        '  (SELECT a as branch_id from UNNEST($2::int[]) a) ' +
        ');',
    deletePromotion: 'DELETE FROM Promotions WHERE id = $1;',
    deletePromotionOffers: 'DELETE FROM Offers WHERE promo_id = $1;',
};

module.exports = sqlQueries;
