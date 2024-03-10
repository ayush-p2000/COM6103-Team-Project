const {body,check, validationResult} = require("express-validator")

const errorsToSession = (req, res, next) => {
    const {errors} = validationResult(req)
    req.session.messages = [...errors.map(error => error.msg)]
    next()
}

exports.validateRegistration = [
    check("firstName","Incorrect First Name").trim().escape().notEmpty().isAlpha(),
    check("lastName","Incorrect Last Name").isAlpha().trim().escape().notEmpty(),
    check("email","Invalid email address").trim().normalizeEmail().isEmail().notEmpty(),
    check("dateOfBirth","Invalid Date Of Birth").trim().escape().isDate({format:"YYYY-MM-DD"}),
    check("password","Password must be at least 4 characters long").trim().escape().notEmpty().isLength({min: 4}),
    check("confirmPassword","Passwords do not match.").trim().escape().notEmpty().custom((value, {req}) => value === req.body.password),
    errorsToSession
]

exports.validateLogin = [
    body("email").trim().normalizeEmail().isEmail().notEmpty(),
    body("password").trim().escape()
]

