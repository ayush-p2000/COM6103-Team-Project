 /*
 * Passport functions
 */

const LocalStrategy = require('passport-local');
const {pbkdf2} = require("node:crypto")
const {searchUser} = require("../model/mongodb")
 const session = require("express-session")
 const mongo = require("../model/mongodb");

// Creates a passport local strategy which determines how user authentication is performed.
 // The verify callback is executed after user submits login form.
const passportStrategy = new LocalStrategy(async function verify(username, password, cb) {
        try {
            const user = await searchUser({username: username});
            if (!user || user.username !== username) {
                // Passes error to the session error handler
                return cb(null, false, {message: 'Incorrect username or password.'})
            }
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
                if (err) throw err;
                if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                    // Passes error to the session error handler
                    return cb(null, false, {message: 'Incorrect username or password.'});
                }
                return cb(null, user);
            });
        } catch (err) {
            return cb(err);
        }
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
const passportSerializeUser = (user, cb) => {
    process.nextTick(function () {
        // Null is passed to the callback if no errors occurred
        cb(null, {user: {id: user.id, username: user.username, role: user.role}});
    });
}

// Clears out the user's data from the session after logging out (when logout button is pressed).
const passportDeserializeUser = (user, cb) => {
    process.nextTick(function () {
        // Null is passed to the callback if no errors occurred
        return cb(null, user);
    });
}

// Catches any errors which occurred during authentication, and passes it into the view as a messages variable with hasMessages flag.
const sessionErrorHandler = (req, res, next) => {
     const msgs = req.session.messages || [];
     res.locals.messages = msgs;
     res.locals.hasMessages = !!msgs.length;
     req.session.messages = [];
     next();
 }

module.exports = {
    passportStrategy,
    passportDeserializeUser,
    passportSerializeUser,
    sessionErrorHandler,
    sessionSetup
}