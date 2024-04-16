const GoogleStrategy = require('passport-google-oauth20').Strategy
const {User} = require("../model/schema/user");


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

                try
                {
                    let checkUser = await User.findOne({email: profile.emails[0].value})

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
