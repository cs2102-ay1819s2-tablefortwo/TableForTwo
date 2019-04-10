let sqlQueries = {
    allBranches: 'SELECT * FROM branches',
    trendingBranches: 'with mostPopularBranches as (\n' +
                            '\tselect b.id as branch_id,\n' +
                                '\tsum(pax) / (select sum(ts.numslots) from timeslot ts where ts.branch_id = b.id) as paxScore\n'+
                            '\tfrom reservations r right join branches b on r.branch_id = b.id\n'+
                            '\twhere r.reserveddate = current_date\n'+
                            '\tgroup by b.id),\n'+
                            '\tweightedScores as (\n'+
                                '\tselect coalesce((avg(rt.rating) / 5 + sum(mpb.paxScore)) / 2, 0) as weightedScore, mpb.branch_id\n'+
                            '\tfrom mostPopularBranches mpb left join ratings rt on mpb.branch_id = rt.branch_id\n'+
                            '\tgroup by mpb.branch_id)\n'+
                        '\tselect b.* from weightedScores ws inner join branches b on b.id = ws.branch_id\n'+
                        '\torder by weightedScore desc limit 5;',
    recommendedBranches: 'SELECT * FROM getRecommendations($1) r INNER JOIN Branches b on r.bid = b.id;'
};

module.exports = sqlQueries;
