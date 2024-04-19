/**
 * Facebook Login Strategy
 * @author Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */

const FacebookStrategy = require('passport-facebook').Strategy
const {User} = require("../model/schema/user");


module.exports = function (passport) {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/auth/facebook/callback'
    },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                facebook_id:profile.id,
                first_name: profile.name.givenName,
                last_name: profile.name.familyName,
                email: profile.username,
                avatar: profile.profileUrl,
                verified: true
            }

            try
            {
                let checkUser = await User.findOne({facebook_id: profile.id})

                if(checkUser){
                    done(null, checkUser)
                }
                else
                {
                    checkUser = await User.create(newUser)
                    done(null, checkUser)
                }
            }
            catch (err)
            {
                console.error(err)
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