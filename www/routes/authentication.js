const express = require('express');
const router = express.Router();
const {passportAuthenticate} = require("../auth/passportAuth")
const {
    getLoginPage,
    getRegisterPage,
    registerUser,
    logoutUser
} = require("../controllers/auth/authenticationController");
const {validateRegistration, validateLogin} = require("../middlewares/validators")
const {isAuthenticated} = require("../middlewares/auth");
const {body} = require("express-validator")
const {validateCaptcha} = require("../middlewares/captcha");

router.get('/login', getLoginPage);
router.post("/login", validateCaptcha, validateLogin, passportAuthenticate)
router.post("/logout", isAuthenticated, logoutUser)

router.get('/register', getRegisterPage);
const sanitizer = body('firstName').notEmpty().trim().escape()
router.post('/register', validateCaptcha, validateRegistration, registerUser)

module.exports = router;