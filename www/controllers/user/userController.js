/*
 * This controller should handle any operations related to user dashboard and miscellaneous user operations
 */

const {getMockUser} = require("../../util/mock/mockData");

function getUserDashboard(req, res, next) {
    //TODO: Add functionality for the user dashboard
    res.render("user/dashboard", {user: getMockUser(), auth: req.isLoggedIn, role: "user"})
}

function getUserProfile(req, res, next) {
    const user = getMockUser()
    res.render("user/user_profile", {user, auth: req.isLoggedIn, role: "user"})
}

module.exports = {
    getUserProfile,
    getUserDashboard
}