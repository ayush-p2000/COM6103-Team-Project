 /*
 * Passport functions
 */

const LocalStrategy = require('passport-local');
const {pbkdf2} = require("node:crypto")
const {searchUser} = require("../model/mongodb")

const passportStrategy = new LocalStrategy(async function verify(username, password, cb) {
        try {
            const user = await searchUser({username: username});
            if (!user || user.username !== username) {
                return cb(null, false, {message: 'Incorrect username or password.'})
            }
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
                if (err) throw err;
                if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                    return cb(null, false, {message: 'Incorrect username or password.'});
                }
                return cb(null, user);
            });
        } catch (err) {
            return cb(err);
        }
    }
)

const passportSerializeUser = (user, cb) => {
    process.nextTick(function () {
        cb(null, {user: {id: user.id, username: user.username, role: user.role}});
    });
}

const passportDeserializeUser = (user, cb) => {
    process.nextTick(function () {
        return cb(null, user);
    });
}

module.exports = {
    passportStrategy,
    passportDeserializeUser,
    passportSerializeUser
}