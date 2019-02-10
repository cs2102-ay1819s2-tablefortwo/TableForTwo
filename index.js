'use strict'

// Retrieve server instance with assoc methods
const server = require('./server')();
const config = require('./configs');

server.create(config);
server.start();