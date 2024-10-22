/**
 * A Validator Middleware to validate form inputs
 * @author Adrian Urbanczyk <aurbanczyk1@sheffield.ac.uk>
 */

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
    check("firstName","Incorrect First Name").trim().escape().notEmpty(),
    check("lastName","Incorrect Last Name").trim().escape().notEmpty(),
    check("email","Invalid email address").trim().isEmail().notEmpty().escape(),
    check("phone", "Invalid phone number. Please provide a UK phone number.").trim().notEmpty().isMobilePhone("en-GB"),
    check("dateOfBirth","Invalid Date Of Birth").trim().escape().isDate({format:"YYYY-MM-DD"}).custom(checkAge).withMessage("You need to be at least 13 years old"),
    check("address_1", "Invalid address 1").trim().escape().notEmpty(),
    check("address_2", "Invalid address 2").trim().escape().notEmpty(),
    check("city", "Invalid city").trim().escape().notEmpty(),
    check("county", "Invalid county").trim().escape().notEmpty(),
    check("country", "Invalid country").trim().escape().notEmpty(),
    check("postcode", "Invalid postcode").trim().escape().notEmpty().isPostalCode("GB"),
    check("password","Password must be at least 8 characters long").escape().notEmpty().isLength({min: 8}),
    check("confirmPassword","Passwords do not match.").escape().notEmpty().custom((value, {req}) => value === req.body.password),
    errorsToSession
]

exports.validateLogin = [
    body("email").trim().isEmail().notEmpty().escape(),
    body("password").trim().escape(),
]

exports.validateDeviceTypeEdit = [
    check("name", "Name cannot be empty!").trim().notEmpty(),
    check("description", "Description cannot be empty!").trim().escape().optional().notEmpty(),
    check("modelType", "Model type cannot be empty!").trim().escape().optional().notEmpty(),
    check("modelBrand", "Model brand cannot be empty!").trim().escape().optional().notEmpty(),
    errorsToSession
]

exports.validateProfileUpdate = [
    check("phone", "Invalid phone number. Please provide a UK phone number.").trim().notEmpty().isMobilePhone("en-GB"),
    check("addressFirst", "Invalid address 1").trim().escape().notEmpty(),
    check("addressSecond", "Invalid address 2").trim().escape().notEmpty(),
    check("city", "Invalid city").trim().escape().notEmpty(),
    check("county", "Invalid county").trim().escape().notEmpty(),
    check("country", "Invalid country").trim().escape().notEmpty(),
    check("postCode", "Invalid postcode").trim().escape().notEmpty().isPostalCode("GB"),
    errorsToSession
]

exports.validateAdminProfileUpdate = [
    check("firstName","Incorrect First Name").trim().escape().notEmpty(),
    check("lastName","Incorrect Last Name").trim().escape().notEmpty(),
    check("phone", "Invalid phone number. Please provide a UK phone number.").trim().notEmpty().isMobilePhone("en-GB"),
    check("addressFirst", "Invalid address 1").trim().escape().notEmpty(),
    check("addressSecond", "Invalid address 2").trim().escape().notEmpty(),
    check("city", "Invalid city").trim().escape().notEmpty(),
    check("country", "Invalid country").trim().escape().notEmpty(),
    check("postCode", "Invalid postcode").trim().escape().notEmpty().isPostalCode("GB"),
    errorsToSession
]

exports.validateDob = [
    check("birthday","Invalid Date Of Birth").trim().escape().isDate({format:"YYYY-MM-DD"}).custom(checkAge).withMessage("You need to be at least 13 years old"),
    errorsToSession
]

