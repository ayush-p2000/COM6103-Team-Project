const express = require('express');
const router = express.Router();
const {passportAuthenticate} = require("../auth/passportAuth")
const {
    getLoginPage,
    getRegisterPage,
    registerUser,
    logoutUser, getForgotPassword, getForgotUser, sendResetPasswordEmail, resetPassword, getResetPasswordPage
} = require("../controllers/auth/authenticationController");
const {validateRegistration, validateLogin} = require("../middlewares/validators")
const {isAuthenticated} = require("../middlewares/auth");
const {body} = require("express-validator")
const {validateCaptcha} = require("../middlewares/captcha");

router.get('/login', getLoginPage);
router.post("/login", validateCaptcha, validateLogin, passportAuthenticate)
router.post("/logout", isAuthenticated, logoutUser)

router.get('/register', getRegisterPage);
router.post('/register', validateCaptcha, validateRegistration, registerUser)

router.get('/forgot-password', getForgotPassword);
router.post('/forgot-password', getForgotUser);

router.get('/reset-password', getResetPasswordPage);
router.post('/reset-password', resetPassword);


module.exports = router;