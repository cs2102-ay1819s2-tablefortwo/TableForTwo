'use strict';
const db = require('../../server/helpers/database').db;

let getBranch = (req, res) => {
    let bid = req.params.bid;
    console.log('Retrieved get request for bid: ' + bid);


};

module.exports = getBranch;