'use strict';
require('dotenv').config();
const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const moment = require('moment');

module.exports = () => {
    let server = express();

    let create = (config) => {
        let routes = require('./routes');

        // Server settings
        server.set('env', config.env);
        server.set('port', config.port);
        server.set('hostname', config.hostname);
        server.set('viewDir', config.viewDir);


        require('../config/passport')(passport); // pass passport for configuration
        // Middleware to parse json
        server.use(bodyParser.urlencoded({
            extended: true
        }));
        server.use(bodyParser.json());
        server.use(require('cookie-parser')(process.env.DATABASE_URL));
        server.use(express.static(require('path').join(__dirname, "../public")));
        server = require('../config/session')(server);
        server.use(require('connect-flash')());
        server.use(passport.initialize());
        server.use(passport.session());

        // default data loaded to into each page.
        server.use(function(req, res, next){
            res.locals.success = req.flash('success');
            res.locals.errors = req.flash('error');
            res.locals.isLoggedIn = req.isAuthenticated();
            next();
        });

        // Initialize view engine
        server.engine('.hbs', expressHandlebars({
            helpers: {
                toDateTime: function(datetime) {
                  return moment(datetime).format('lll');
                  },
                toDate: function(date) {
                    return moment(date).format('LL');
                },
                toTime: function(time) {
                    return moment(time, ["h:mm A", "H:mm"]).format('LT')
                }
            },
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
