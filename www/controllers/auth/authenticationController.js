/*
 * This controller should handle any operations related to auth such as login, logout, and registration
 */

const {User} = require("../../model/schema/user")
const {randomBytes, pbkdf2} = require("node:crypto")
const {promisify} = require('node:util')
const { validationResult } = require("express-validator")
const pbkdf2Promise = promisify(pbkdf2)

const registerUser = async (req, res, next) => {
    try {
        const {firstName, lastName, dateOfBirth, email, password, confirmPassword} = req.body

        // These fields should be included in the form and validated appropriately
        // Refer to the bug - TSP-94
        const phone_number = "123123123";

        const address = {
            address_1: "123 Main St",
            address_2: "Apt 101",
            city: "New York",
            county: "Manhattan",
            country: "USA",
            postcode: "10001"
        }


        const salt = randomBytes(16)
        const hashedPassword = await pbkdf2Promise(password, salt, 310000, 32, 'sha256')
        const user = new User({
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            phone_number,
            email,
            password: hashedPassword,
            salt,
            address
        });
        if(req.session.messages.length > 0){
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

const logoutUser = (req,res,next) => {
    req.logout(err => {
        if(err) return next(err)
        res.redirect("/login")
    })
}

function getLoginPage(req, res, next) {
    res.render("authentication/login", {auth: req.isLoggedIn, user:req.user})
}

function getRegisterPage(req, res, next) {
    res.render("authentication/register", {auth: req.isLoggedIn, user:req.user})
}

module.exports = {
    getLoginPage,
    getRegisterPage,
    registerUser,
    logoutUser
}