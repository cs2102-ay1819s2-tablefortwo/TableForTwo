let sqlQueries = {
    getCustomerTransactions: 'SELECT * FROM PointTransactions WHERE customer_id = $1',
    redeemPromoFromPoints: 'INSERT INTO  Redemption(customer_id, promo_id) VALUES($1, $2)'
};

module.exports = sqlQueries;
