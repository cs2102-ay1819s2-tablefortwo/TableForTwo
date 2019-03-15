let sqlQueries = {
    allPromotions: "SELECT * from Promotions",
    createPromotion: "INSERT INTO Promotions(branch_id, name, promo_code, description, start_timeslot, end_timeslot, " +
        "start_date, end_date, visibility) VALUES(1, $1, $2, $3, $4, $5, $6, $7, $8)"
};

module.exports = sqlQueries;
