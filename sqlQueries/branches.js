let sqlQueries = {
    allBranches: 'SELECT * FROM branches',
    recommendedBranches: 'SELECT * FROM getRecommendations($1) r INNER JOIN Branches b on r.bid = b.id;'
};

module.exports = sqlQueries;
