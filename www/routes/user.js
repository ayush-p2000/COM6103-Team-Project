const express = require('express');
const {faker} = require("@faker-js/faker");
const router = express.Router();

const {getUserProfile, getUserDashboard, updateUserDetails} = require("../controllers/user/userController");
const {getMyItems} = require("../controllers/marketplace/marketplaceController");
const {validateProfileUpdate} = require('../middlewares/validators')

router.get('/profile', getUserProfile)

router.post('/profile',validateProfileUpdate, updateUserDetails)

router.get('/dashboard', getUserDashboard);

router.get('/my-items/:page?', getMyItems);

module.exports = router;
