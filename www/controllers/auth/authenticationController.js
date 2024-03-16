/*
 * This controller should handle any operations related to auth such as login, logout, and registration
 */

const {User} = require("../../model/schema/user")
const {randomBytes, pbkdf2} = require("node:crypto")
const {promisify} = require('node:util')
const { validationResult } = require("express-validator")
const pbkdf2Promise = promisify(pbkdf2)
let user = ""

//------------------------------------------------- User Registration Data feeding and Authenticating -------------------------------------------//

const registerUser = async (req, res, next) => {
    let messages;
    try {
        const {
            firstName,
            lastName,
            dateOfBirth,
            email,
            password,
            phone,
            address_1,
            address_2,
            postcode,
            city,
            county,
            country
        } = req.body

        // These fields should be included in the form and validated appropriately
        // Refer to the bug - TSP-94
        const phone_number = phone;

        const address = {
            address_1: address_1,
            address_2: address_2,
            city: city,
            county: county,
            country: country,
            postcode: postcode
        }


        const salt = randomBytes(16)
        const hashedPassword = await pbkdf2Promise(password, salt, 310000, 32, 'sha256')
        const emailCheck = await User.findOne({email});
        if (emailCheck) {
            messages = ['User email already exists']
            return res.render("authentication/register", {messages: messages, hasMessages: messages.length>0, auth: req.isLoggedIn, user:req.user}) // needs refined alert
        } else {
            user = new User({
                first_name: firstName,
                last_name: lastName,
                date_of_birth: dateOfBirth,
                phone_number,
                email,
                password: hashedPassword,
                salt,
                address
            });
        }
        if (req.session.messages.length > 0) {
            return res.redirect("/register")
        }

        await user.save()

        req.login(user, err => {
            if (err)
                return next(err)
            res.redirect("/dashboard")
        })
    } catch (err) {
        return next(err)
    }
}

//----------------------------------------------------- Logging Out User -------------------------------------------------------------------------------//

const logoutUser = (req,res,next) => {
    req.logout(err => {
        if(err) return next(err)
        res.redirect("/login")
    })
}

//---------------------------------------------------- Rendering Login Page ----------------------------------------------------------------------------//

function getLoginPage(req, res, next) {
    res.render("authentication/login", {auth: req.isLoggedIn, user:req.user})
}

//---------------------------------------------------- Rendering Register Page ----------------------------------------------------------------------------//


function getRegisterPage(req, res, next) {
    res.render("authentication/register", {auth: req.isLoggedIn, user:req.user})
}

module.exports = {
    getLoginPage,
    getRegisterPage,
    registerUser,
    logoutUser
}

//---------------------------------------------------- End of File ----------------------------------------------------------------------------//
