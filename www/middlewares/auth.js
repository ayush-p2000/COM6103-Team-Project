/**
 * An Authentication Middleware to secure routes
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 * @author Ayush Prajapati <aprajapati1@sheffield.ac.uk>
 */

const {STAFF, ADMIN} = require("../model/enum/roleTypes")
const {User} = require("../model/models");
const isAuthenticated = (req, res, next) => {
    req.isLoggedIn = false;
    if(req.isAuthenticated() && req.user){
        req.isLoggedIn = true;
        next();
    } else {
        res.redirect("/login")
    }
}

// This middleware should be used where the route is not restricted to logged-in users but authentication info is required.
const authInfo = (req, res, next) => {
    req.isLoggedIn = !!(req.isAuthenticated() && req.user);
    next()
}

const isStaff = (req,res,next) => {
    if(req.user.role < STAFF){
        res.redirect("/dashboard")
    }
    next();
}

const isSuperAdmin = (req,res,next) => {
    if(req.user.role < ADMIN){
        res.redirect("/dashboard")
    }
    next();
}

const validateVerification = async (req, res,next) => {
    const userFromEmail = await User.findOne({email: req.body.email})

        const verifyMessage = ['Please verify your email']
        const registerUserMessage = ['User does not exist. Please register before you can access']
        if (userFromEmail) {
            if(userFromEmail.google_id == null) {
                if (userFromEmail.verified === false) {
                    res.render("authentication/login", {
                        auth: req.isLoggedIn, user: req.user, messages: verifyMessage,
                        hasMessages: verifyMessage.length > 0,
                    })
                } else {
                    next();
                }
            }
            else
                {
                    const verifyMessage = ['This account was registered using Google Authentication. Please log in with Google to continue']
                    res.render("authentication/login", {
                        auth: req.isLoggedIn, user: req.user, messages: verifyMessage,
                        hasMessages: verifyMessage.length > 0,
                    })
                }
        }
        else {
            res.render("authentication/register", {
                auth: req.isLoggedIn, user: req.user, messages: registerUserMessage,
                hasMessages: verifyMessage.length > 0
            })

        }

    }


module.exports = {
    isAuthenticated,
    isStaff,
    isSuperAdmin,
    authInfo,
    validateVerification
}