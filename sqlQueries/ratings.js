let sqlQueries = {
    getAvgBranchRating: 'select avg(rating) as rating from ratings where branch_id = $1;',
    getRatingsForBranch: 'select rating, comments, customer_id from ratings where branch_id = $1;',
    addRating: 'INSERT INTO ratings (rating, comments, customer_id, branch_id) VALUES ($1, $2, $3, $4) ON CONFLICT(customer_id, branch_id) DO UPDATE SET rating = EXCLUDED.rating, comments = EXCLUDED.comments;'
};

module.exports = sqlQueries;