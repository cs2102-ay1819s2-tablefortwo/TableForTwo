const expSession = require('express-session');

let configSession = (server) => {
    server.use(expSession({
        key: 'user_id',    // name of cookie
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { expires: 600000 }
    }));
    return server;
};

module.exports = configSession;