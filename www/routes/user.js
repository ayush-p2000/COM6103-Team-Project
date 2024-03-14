const express = require('express');
const {faker} = require("@faker-js/faker");
const router = express.Router();

const {getUserProfile, getUserDashboard} = require("../controllers/user/userController");
const {getMyItems} = require("../controllers/marketplace/marketplaceController");

router.get('/profile', getUserProfile)

router.get('/dashboard', getUserDashboard);

router.get('/my-items/:page?', getMyItems);

module.exports = router;
