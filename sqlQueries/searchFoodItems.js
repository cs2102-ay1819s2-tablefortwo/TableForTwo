let sqlQueries = {
    findByLocation: 'select * from branches where barea like $1',
    findByName: 'select * from menuitems where name like $1',
    findByNameAndLocation: 'select * from branches where branches.barea like $2 and branches.id in(select bid from sells where sells.mid in (select id from menuitems where name like $1));' 
};
module.exports = sqlQueries;