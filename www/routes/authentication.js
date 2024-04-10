const express = require('express');
const router = express.Router();
const passport = require('passport');
const { passportAuthenticate } = require("../auth/passportAuth");
const {
    getLoginPage,
    getRegisterPage,
    registerUser,
    logoutUser,
    getForgotPassword,
    getForgotUser,
    resetPassword,
    getResetPasswordPage, googleAuth, googleAuthCallback, facebookAuth, facebookAuthCallback
} = require("../controllers/auth/authenticationController");
const { validateRegistration, validateLogin } = require("../middlewares/validators");
const { isAuthenticated } = require("../middlewares/auth");
const { validateCaptcha } = require("../middlewares/captcha");
const {getUserDashboard} = require("../controllers/user/userController");

// Local Authentication Routes
router.get('/login', getLoginPage);
router.post('/login', validateCaptcha, validateLogin, passportAuthenticate);
router.post('/logout', isAuthenticated, logoutUser);

router.get('/register', getRegisterPage);
router.post('/register', validateCaptcha, validateRegistration, registerUser);

router.get('/forgot-password', getForgotPassword);
router.post('/forgot-password', getForgotUser);

router.get('/reset-password', getResetPasswordPage);
router.post('/reset-password', resetPassword);

// Google Authentication Routes
router.get('/auth/google', googleAuth)

router.get('/auth/google/callback', googleAuthCallback, getUserDashboard)
// Facebook Authentication Routes
router.get('/auth/facebook/', facebookAuth)

router.get('/auth/facebook/callback', facebookAuthCallback, getUserDashboard)


module.exports = router;
