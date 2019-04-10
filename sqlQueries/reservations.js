let sqlQueries = {
    allReservations: 'SELECT * FROM Reservations',
    getCustomerReservations: 'SELECT R.id, B.bName, R.pax, R.reservedslot, R.reserveddate, P.promo_code, R.confirmed FROM (Reservations R INNER JOIN Branches B ON R.branch_id = B.id) LEFT JOIN Promotions P on R.promo_used = P.promo_code WHERE R.customer_id = $1',
    getOwnerUnconfirmedReservations: 'select r.id as reservation_id, restaurant_id, bname, u.username, pax, reservedslot, reserveddate, promo_code from \n' +
        '\t((select * from branches where branch_owner_id = $1) as b inner join \n' +
        '\treservations r on b.id = r.branch_id inner join promotions p on promo_used = p.promo_code) inner join users u on u.id = r.customer_id\n' +
        '\twhere r.confirmed = false;',
    confirmReservation: 'UPDATE reservations SET confirmed = TRUE WHERE id = $1 returning *',
    deleteReservation: 'DELETE FROM Reservations where id = $1;',
    getTimeslotsForReservation: 'SELECT * FROM Timeslot T INNER JOIN Reservations R ON R.branch_id = T.branch_id WHERE R.customer_id = $1 AND T.dateslot = R.reserveddate;',
    updateReservation: 'UPDATE Reservations SET pax = $1, reservedslot = $2 WHERE id = $3;',
};

module.exports = sqlQueries;
