/*
 * This controller should handle any operations related to user dashboard and miscellaneous user operations
 */

const {getMockUser} = require("../../util/mock/mockData");

function getUserDashboard(req, res, next) {
    res.render("user/dashboard", {user: req.user , auth: req.isLoggedIn})
}

function getUserProfile(req, res, next) {
    // TODO Fetch Full data of the user from the database
    res.render("user/user_profile", {user: req.user , auth: req.isLoggedIn})
}

module.exports = {
    getUserProfile,
    getUserDashboard
}