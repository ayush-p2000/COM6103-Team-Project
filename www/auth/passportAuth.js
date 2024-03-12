/*
* Passport functions
*/

const LocalStrategy = require('passport-local');
const {pbkdf2} = require("node:crypto")
const {searchUser} = require("../model/mongodb")
const session = require("express-session")
const mongo = require("../model/mongodb");
const passport = require("passport")
const crypto = require("node:crypto")

// Creates a passport local strategy which determines how user authentication is performed.
// The verify callback is executed after user submits login form.
const passportStrategy = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async function verify(email, password, callback) {
        try {
            const user = await searchUser({email: email});
            if (!user || user.email !== email) {
                // Passes error to the session error handler
                return callback(null, false, {message: 'Incorrect email or password.'})
            }
            // Encrypt password from the form, with user's salt.
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
                if (err) throw err;
                // Check if hashes match -> check if provided passwords is the same as user's password.
                if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                    // Passes error to the session error handler
                    return callback(null, false, {message: 'Incorrect email or password.'});
                }
                return callback(null, user);
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

// Setup express sessions with MongoDB storage.
const sessionSetup = session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    store: mongo.store,
    name: "sessionId"
})

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