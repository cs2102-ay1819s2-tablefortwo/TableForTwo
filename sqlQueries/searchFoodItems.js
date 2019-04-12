let sqlQueries = {
    findByLocation: 'select *, inlineMax(inlineMax(similarity(text(baddress), $1), similarity(text(barea), $1)), similarity(text(bname), $1)) as sml from branches where text(barea) % $1 or text(baddress) % $1 or text(bname) % $1 order by sml desc limit 10;',
    findByName: 'SELECT name, similarity(text(name), $1) AS sml FROM menuitems WHERE text(name) % $1 order by sml desc limit 10;',
    findByNameAndLocation: "select * from branches\
                                where text(branches.barea) % $2 or text(branches.baddress) % $2 or text(branches.bname) % $2\
                                    and branches.id in\
                                        (select bid from sells where sells.mid in (select id from menuitems where text(name) % $1));" 
};
module.exports = sqlQueries;