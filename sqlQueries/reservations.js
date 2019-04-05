let sqlQueries = {
    allReservations: 'SELECT * FROM Reservations',
    getCustomerReservations: 'SELECT B.bName, R.pax, R.reservedslot, R.reserveddate FROM Reservations R INNER JOIN Branches B ON R.branch_id = B.id WHERE R.customer_id = $1'
};

module.exports = sqlQueries;
