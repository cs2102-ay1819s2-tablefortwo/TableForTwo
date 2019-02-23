const expSession = require('express-session');

let session = expSession.session({
    genid: (req) => {
        console.log('Generating unique session ID');
        console.log(req.sessionID);
        return uuid(); // use UUIDs for session IDs
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnitialized: false,
    cookie: { expires: 600000 }
});

module.exports = session;