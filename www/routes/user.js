const express = require('express');
const {faker} = require("@faker-js/faker");
const router = express.Router();

const {getUserProfile, getUserDashboard} = require("../controllers/user/userController");
router.get('/profile', getUserProfile)

router.get('/dashboard', getUserDashboard);


module.exports = router;
