const express = require('express');
const router = express.Router();

const {getLoginPage, getRegisterPage} = require("../controllers/auth/authenticationController");

router.get('/login', getLoginPage);

router.get('/register', getRegisterPage );

module.exports = router;