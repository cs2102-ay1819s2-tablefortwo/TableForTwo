let sqlQueries = {
    findByLocation: 'select *, inlineMax(similarity(baddress, $1), similarity(barea, $1)) as sml from branches where barea % $1 or baddress % $1 order by sml desc limit 10;',
    findByName: 'SELECT name, similarity(name, $1) AS sml FROM menuitems WHERE name % $1 order by sml desc limit 10;',
    findByNameAndLocation: "select * from branches\
                                where branches.barea % $2 or branches.baddress % $2\
                                    and branches.id in\
                                        (select bid from sells where sells.mid in (select id from menuitems where name % $1));" 
};
module.exports = sqlQueries;