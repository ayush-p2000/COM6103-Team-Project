const express = require('express');
const router = express.Router();

const {getLandingPage} = require("../controllers/landingController");

/* GET home page. */
router.get('/', getLandingPage);

module.exports = router;
