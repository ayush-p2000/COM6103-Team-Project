const express = require('express');
const router = express.Router();

const { passportAuthenticate } = require("../auth/passportAuth")
const {getLoginPage, getRegisterPage, registerUser ,logoutUser} = require("../controllers/auth/authenticationController");
const {isAuthenticated} = require("../middlewares/auth");

router.get('/login', getLoginPage);
router.post("/login",passportAuthenticate)
router.post("/logout", isAuthenticated, logoutUser)

router.get('/register', getRegisterPage );
router.post('/register', registerUser)

module.exports = router;