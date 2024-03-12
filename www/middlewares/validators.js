const {body,check, validationResult} = require("express-validator")

const errorsToSession = (req, res, next) => {
    const {errors} = validationResult(req)
    req.session.messages = [...errors.map(error => error.msg)]
    next()
}

const checkAge = (value, {req}) => {
    const dateNow = new Date()
    const inputDate = new Date(value)

    // Milliseconds to years
    const yearDiff = Math.abs(dateNow.getTime() - inputDate.getTime()) / (1000 * 3600 * 24 * 365.25)

    return yearDiff >= 13
}

exports.validateRegistration = [
    check("firstName","Incorrect First Name").trim().escape().notEmpty().isAlpha(),
    check("lastName","Incorrect Last Name").isAlpha().trim().escape().notEmpty(),
    check("email","Invalid email address").trim().normalizeEmail().isEmail().notEmpty(),
    check("dateOfBirth","Invalid Date Of Birth").trim().escape().isDate({format:"YYYY-MM-DD"}).custom(checkAge).withMessage("You need to be at least 13 years old"),
    check("password","Password must be at least 8 characters long").trim().escape().notEmpty().isLength({min: 8}),
    check("confirmPassword","Passwords do not match.").trim().escape().notEmpty().custom((value, {req}) => value === req.body.password),
    errorsToSession
]

exports.validateLogin = [
    body("email").trim().normalizeEmail().isEmail().notEmpty(),
    body("password").trim().escape()
]

