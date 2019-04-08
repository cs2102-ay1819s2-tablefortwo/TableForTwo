let sqlQueries = {
    nonExclusivePromotions: 'with usage_stats as (\n' +
        '\tselect p.id, count(*) as usage_count, true as trending\n' +
        '\tfrom promotions p inner join reservations r on p.promo_code = r.promo_used \n' +
        '\twhere r.reserveddate > now() - interval \'2 week\' and p.is_exclusive = false\n' +
        '\tgroup by p.id\n' +
        '\tlimit 3\n' +
        ')\n' +
        'select p.id, name, description, promo_code, redemption_cost, is_exclusive, start_date, end_date, start_timeslot, end_timeslot, COALESCE(usage_count, 0) as usage_count, trending\n' +
        '\tfrom promotions p left join usage_stats u on p.id = u.id where p.is_exclusive = false and p.start_date <= now() and p.end_date >= now()\n' +
        '\torder by usage_count desc\n',
    allPromotions: 'with usage_stats as (\n' +
        '\tselect p.id, count(*) as usage_count, true as trending\n' +
        '\tfrom promotions p inner join reservations r on p.promo_code = r.promo_used \n' +
        '\twhere r.reserveddate > now() - interval \'2 week\'\n' +
        '\tgroup by p.id\n' +
        '\tlimit 3\n' +
        ')\n' +
        'select p.id, name, description, promo_code, redemption_cost, is_exclusive, start_date, end_date, start_timeslot, end_timeslot, COALESCE(usage_count, 0) as usage_count, trending\n' +
        '\tfrom promotions p left join usage_stats u on p.id = u.id where p.start_date <= now() and p.end_date >= now()\n' +
        '\torder by usage_count desc\n',
    exclusivePromotions: 'select * \n' +
        '\tfrom redemption r inner join promotions p on r.promo_id = p.id\n' +
        '\twhere p.start_date <= now() and p.end_date >= now() and r.customer_id = $1',
    getPromotion: 'SELECT * FROM Promotions WHERE id = $1',
    createPromotion: 'INSERT INTO Promotions(name, promo_code, description, start_timeslot, end_timeslot, start_date, end_date, is_exclusive, redemption_cost) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id',
    createOffers: 'INSERT INTO Offers(branch_id, promo_id) VALUES($1, $2)',
    promoBranches: 'SELECT * FROM Branches b INNER JOIN Restaurants r on b.restaurant_id = r.id WHERE b.id in (SELECT branch_id FROM Offers WHERE promo_id = $1)',
    updatePromotion: 'UPDATE Promotions SET name = $2, description = $3, promo_code = $4, is_exclusive = $5, start_date = $6, end_date = $7, start_timeslot = $8, end_timeslot = $9, redemption_cost = $10 WHERE id = $1',
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
    promotionsForRedemption: 'select * \n' +
        '\tfrom promotions p \n' +
        '\twhere is_exclusive = true \n' +
        '\tand not exists (\n' +
        '\t\tselect 1\n' +
        '\t\tfrom redemption\n' +
        '\t\twhere customer_id = $1\n' +
        '\t\tand promo_id = p.id\n' +
        '\t)' +
        '\tand redemption_cost <= (\n' +
        '\t\tselect sum(point)\n' +
        '\t\tfrom pointtransactions\n' +
        '\t\twhere customer_id = $1\n' +
        '\t)'
};

module.exports = sqlQueries;
