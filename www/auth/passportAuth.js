/**
 * Passport Authentication
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */

const LocalStrategy = require('passport-local');
const {pbkdf2} = require("node:crypto")
const {searchUser} = require("../model/mongodb")
const {SEVEN_DAYS_S} = require("../util/time/time")
const session = require("express-session")
const passport = require("passport")
const crypto = require("node:crypto")
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose")
const db = mongoose.connection

// Creates a passport local strategy which determines how user authentication is performed.
// The verify callback is executed after user submits login form.
const passportStrategy = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async function verify(req, email, password, callback) {
        try {
            const user = await searchUser({email: email});
            if (!user || user.email !== email) {
                // Passes error to the session error handler
                return callback(null, false, {message: 'Incorrect email or password.'})
            }
            if (user.active == false) {
                return callback(null, false, {message: 'Account has been deactivated'})
            }
            // Encrypt password from the form, with user's salt.
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
                if (err) throw err;
                // Check if hashes match -> check if provided passwords is the same as user's password.
                if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                    // Passes error to the session error handler
                    return callback(null, false, {message: 'Incorrect email or password.'});
                }

                return callback(null, user, {});
            });
        } catch (err) {
            return callback(err);
        }
    }
)

// Authorisation / Login function
const passportAuthenticate = passport.authenticate('local', {
        successReturnToOrRedirect: '/dashboard',
        failureRedirect: '/login',
        failureMessage: true
    }
)

let sessionSetup;
let store;

if (process.env.ENVIRONMENT !== 'test') {
// Mongo Session Storage Setup
    store = MongoStore.create({
        client: db.getClient(),
        dbName: process.env.MONGO_DBNAME,
        collection: 'sessions',
        crypto: {
            secret: process.env.STORE_SECRET || "secret",
        },
        ttl: SEVEN_DAYS_S, // 7 days default session expiration
    })

// Setup express sessions with MongoDB storage.
    sessionSetup = session({
        secret: process.env.SESSION_SECRET || "secret",
        store,
        secure: true,
        resave: true,
        saveUninitialized: false,
    })
} else {
    sessionSetup = session({
        secret: process.env.SESSION_SECRET || "secret",
        secure: true,
        resave: true,
        saveUninitialized: false,
    })
}

// Determines what data is stored in session after the user is authenticated (after login form is submitted).
const passportSerializeUser = (user, callback) => {
    process.nextTick(function () {
        // Null is passed to the callback if no errors occurred
        callback(null, {id: user.id, username: user.username, role: user.role, email: user.email});
    });
}

// Clears out the user's data from the session after logging out (when logout button is pressed).
const passportDeserializeUser = (user, callback) => {
    process.nextTick(function () {
        // Null is passed to the callback if no errors occurred
        return callback(null, user);
    });
}

// Catches any errors which occurred during authentication, and passes it into the view as a messages variable with hasMessages flag.
const sessionErrorHandler = (req, res, next) => {
    const msgs = req.session.messages || [];
    res.locals.messages = msgs;
    res.locals.failedCaptcha = !!msgs.includes("Google ReCaptchaV3 Check Failed!");
    res.locals.hasMessages = !!msgs.length;
    req.session.messages = [];
    next();
}

module.exports = {
    passportStrategy,
    passportDeserializeUser,
    passportSerializeUser,
    passportAuthenticate,
    sessionErrorHandler,
    sessionSetup,
}