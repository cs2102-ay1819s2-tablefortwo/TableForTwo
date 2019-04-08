let sqlQueries = {
    insertPointTransaction: 'INSERT INTO PointTransactions(reservation_id, customer_id, point, description) VALUES($1, $2, $3, $4)',
    getCustomerTransaction: 'SELECT * FROM PointTransactions WHERE customer_id = $1',
    getCustomerRedemption: 'SELECT * FROM Redemptions',
    redeemPromoFromPoints: 'INSERT INTO  Redemption(customer_id, promo_id) VALUES($1, $2)'
};

module.exports = sqlQueries;
