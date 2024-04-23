const express = require('express');
const router = express.Router();

const {getLandingPage} = require("../controllers/landingController");
const {isAuthenticated} = require("../middlewares/auth");
const contactUs = require("../middlewares/Contact");

/* GET home page. */
router.get('/', getLandingPage);
router.post('/', contactUs)

module.exports = router;

