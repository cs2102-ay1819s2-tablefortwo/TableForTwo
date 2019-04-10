let sqlQueries = {
    allBranches: 'SELECT * FROM branches',
    trendingBranches: "with mostPopularBranches as (\
                            select b.id as branch_id,\
                                sum(pax) / (select sum(ts.numslots) from timeslot ts where ts.branch_id = b.id) as paxScore\
                            from reservations r right join branches b on r.branch_id = b.id\
                            --where r.reserveddate = current_date\
                            group by b.id),\
                            weightedScores as (\
                                select coalesce((avg(rt.rating) / 5 + sum(mpb.paxScore)) / 2, 0) as weightedScore, mpb.branch_id\
                            from mostPopularBranches mpb left join ratings rt on mpb.branch_id = rt.branch_id\
                            group by mpb.branch_id)\
                        select b.* from weightedScores ws inner join branches b on b.id = ws.branch_id\
                        order by weightedScore desc limit 5;"
};

module.exports = sqlQueries;
