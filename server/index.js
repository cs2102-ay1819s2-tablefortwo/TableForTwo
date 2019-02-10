'use strict';

const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');

module.exports = () => {
    let server = express();

    let create = (config) => {
        let routes = require('./routes');

        // Server settings
        server.set('env', config.env);
        server.set('port', config.port);
        server.set('hostname', config.hostname);
        server.set('viewDir', config.viewDir);

        // Middleware to parse json
        server.use(bodyParser.json());

        // Initialize view engine
        server.engine('.hbs', expressHandlebars({
            defaultLayout: 'default',
            layoutsDir: config.viewDir + '/layouts',
            extname: '.hbs'
        }));
        server.set('views', server.get('viewDir'));
        server.set('view engine', '.hbs');

        // Initialize routes
        routes.init(server);
    };

    let start = () => {
        // Retrieve hostname, port server settings
        let hostname = server.get('hostname');
        let port = server.get('port');

        server.listen(port, () => {
            console.log('Express server listening on - http://' + hostname + ':' + port')
        });
    };

    return { create: create, start: start };
};