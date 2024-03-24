const express = require('express');
const router = express.Router();

const {getLandingPage} = require("../controllers/landingController");
const {isAuthenticated} = require("../middlewares/auth");

/* GET home page. */
router.get('/', getLandingPage);

module.exports = router;

