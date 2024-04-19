const express = require('express');
const router = express.Router();
const { passportAuthenticate } = require("../auth/passportAuth");
const {
    getLoginPage,
    getRegisterPage,
    registerUser,
    logoutUser,
    getForgotPassword,
    getForgotUser,
    resetPassword,
    getResetPasswordPage, googleAuth, googleAuthCallback, facebookAuth, facebookAuthCallback, verifyEmail,
} = require("../controllers/auth/authenticationController");
const { validateRegistration, validateLogin } = require("../middlewares/validators");
const { isAuthenticated, validateVerification} = require("../middlewares/auth");
const { validateCaptcha } = require("../middlewares/captcha");
const {getUserDashboard} = require("../controllers/user/userController");

// Local Authentication Routes
router.get('/login', getLoginPage);
router.post('/login', validateCaptcha, validateLogin,(req,res) => {
    console.log(req.body.email)
    res.status(200)
}, validateVerification, passportAuthenticate);
router.post('/logout', isAuthenticated, logoutUser);

// Registration Routes
router.get('/register', getRegisterPage);
router.get('/verify',  verifyEmail)
router.post('/register', validateCaptcha, validateRegistration, registerUser);

// Forget password routes
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
