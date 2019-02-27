let sqlQueries = {
    findByLocation: 'select * from branches where barea like $1',
    findByName: 'select * from menuitems where name like $1',
    findByNameAndLocation: 'with loc as (select * from branches where barea like $2), menus as (select mid from sells where sells.bid = loc.id) select * from menuitems where menuitems.id = menus.mid and name like $1'
};

module.exports = sqlQueries;