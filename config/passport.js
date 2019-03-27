const db = require('../server/helpers/database').db;
const encrypt = require('../server/helpers/encryption');
const userSqlQueries = require('../sqlQueries/users');
const LocalStrategy = require('passport-local').Strategy;

let loginStrategy = new LocalStrategy({
    passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function (req, username, password, done) {
        console.log('running login strategy on ' + req.body.name);
        let queryUser = username;
        db.query(userSqlQueries.authUser, [queryUser])
            .then(user => {
                if (user.rowCount == 0) {
                    return done(null, false, { message: 'No matching record for this username.' });
                } else if (user.rowCount > 1) {
                    return done('duplicate entries of ' + username + ' in db', user.rows);
                }

                // successfully retrieved user from db
        
                console.log('retrieved user ' + JSON.stringify(user.rows[0]));
                let hashedPassword = user.rows[0].password;
                // check if clear text password matches with hash
                let isValidPassword = encrypt.validatePassword(password, hashedPassword);
                if (isValidPassword) {
                    return done(null, user.rows[0]);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
    }
);

let signupStrategy = new LocalStrategy({
    passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    (req, username, password, done) => {
        console.log('running signup strategy');
        db.query(userSqlQueries.authUser, [username])
            .then(user => {
                // no user created for this username
                if (user.rowCount == 0) {
                    let hashedPassword = encrypt.generateHash(password);

                    console.log('adding new signup ' + username);
                    // add new user to db 
                    db.query(userSqlQueries.signupUser, [req.body.name, username, hashedPassword])
                        .then((created_user) => {
                            done(null, created_user.rows[0], { message: 'successful signup' })
                        })
                        .catch(err => {
                            console.error(err);
                        });
                } else {
                    return done(null, user.rows[0], { message: 'Username already exists!' });
                }
            })
            .catch(err => console.error(err));
    }
);

/**
 * Handles serialization and deserialization of User object to uid in sessions
 * @param {any} passport
 */
let serializeUser = (passport) => {
    passport.serializeUser((uid, done) => done(null, uid));
};

let deserializeUser = (passport) => {
    passport.deserializeUser((user, done) => {
        db.query(userSqlQueries.findById, [user.id])
            .then(res => {
                if (!res) {
                    return done('No match found', null);
                }
                done(null, res.rows[0]);
            });
    });
};

module.exports = function (passport) {
    serializeUser(passport);
    deserializeUser(passport);
    passport.use('local-login', loginStrategy);
    passport.use('local-signup', signupStrategy);
};
