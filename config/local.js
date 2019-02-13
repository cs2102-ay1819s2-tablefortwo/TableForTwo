'use strict';
const path = require('path');

let localConfig = {
    hostname: 'localhost',
    port: 3000,
    viewDir: path.join(__dirname + '/../views'),
    partialsDir: path.join(__dirname + '/../views/partials/'),
    layoutsDir: path.join(__dirname + '/../views/layouts/')
};

module.exports = localConfig;