'use strict';

const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

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
        server.use(express.static(require('path').join(__dirname, "../public")))
        server.use(bodyParser.urlencoded({
            extended: true
        }));
        server.use(bodyParser.json());
        server.use(require('../config/session'));
        server.use(passport.initialize());
        server.use(passport.session())
        passport = require('../config/passport')(passport);

        // Initialize view engine
        server.engine('.hbs', expressHandlebars({
            defaultLayout: 'index',
            layoutsDir: config.layoutsDir,
            partialsDir: config.partialsDir,
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
            console.log('Express server listening on - http://' + hostname + ':' + port);
        });
    };

    return { server: server, create: create, start: start };
};