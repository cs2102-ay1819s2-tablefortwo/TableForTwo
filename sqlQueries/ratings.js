let sqlQueries = {
    getAvgBranchRating: 'select avg(rating) as rating from ratings where branch_id = $1;',
    getRatingsForBranch: 'select rating, comments from ratings where branch_id = $1;',
    addRating: 'insert into ratings(rating, comments, customer_id, branch_id) SELECT $1, $2, $3, $4 WHERE NOT EXISTS (SELECT 1 FROM ratings WHERE customer_id = $3 and branch_id = $4);'
};

module.exports = sqlQueries;