const GoogleStrategy = require('passport-google-oauth20').Strategy
const {User} = require("../model/schema/user");
const {session} = require("express/lib/request");
/**
 * Google Login Strategy
 * @author Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
            },
        async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    google_id:profile.id,
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                    verified: true
                }

            try {
                let checkUser = await User.findOne({ google_id: profile.id });

                if (checkUser) {
                    // If a user with Google ID exists, log in with that user
                    done(null, checkUser);
                } else {
                    // Check if a user with the same email exists
                    const existingUser = await User.findOne({ email: profile.emails[0].value });

                    if (existingUser) {

                        //Alert message handler
                        done(null, false, {message: "User with the same email already exists. Please log in."});
                    }
                    else {
                        checkUser = await User.create(newUser);
                        done(null, checkUser);
                    }
                }
            } catch (err) {
                console.error(err);
            }

        }
        )
    )

    passport.serializeUser( (user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser( (user, done) => {
        user.findById(id, (err, user) => done(err, user))
    })
}
