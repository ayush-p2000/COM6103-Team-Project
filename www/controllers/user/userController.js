/*
 * This controller should handle any operations related to user dashboard and miscellaneous user operations
 */

const {getMockUser} = require("../../util/mock/mockData");

function getUserDashboard(req, res, next) {
    //TODO: Add functionality for the user dashboard
    res.render("user/dashboard", {user: req.user , auth: req.isLoggedIn})
}

function getUserProfile(req, res, next) {
    const user = getMockUser()
    res.render("user/user_profile", {user: req.user , auth: req.isLoggedIn})
}

module.exports = {
    getUserProfile,
    getUserDashboard
}