const express = require('express');
const {faker} = require("@faker-js/faker");
const router = express.Router();

const {getUserProfile, getUserDashboard, updateUserDetails} = require("../controllers/user/userController");
const {getMyItems} = require("../controllers/marketplace/marketplaceController");
const {insertStaffDetails} = require("../controllers/user/userController");

router.get('/profile', getUserProfile)

router.post('/profile', updateUserDetails)

router.get('/dashboard', getUserDashboard);

router.get('/my-items/:page?', getMyItems);

router.post('/accounts', insertStaffDetails );

module.exports = router;
