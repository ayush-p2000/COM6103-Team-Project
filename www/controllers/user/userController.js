/*
 * This controller should handle any operations related to user dashboard and miscellaneous user operations
 */

const {getMockUser} = require("../../util/mock/mockData");

function getUserDashboard(req, res, next) {
    res.render("user/dashboard", {user: req.user , auth: req.isLoggedIn})
}

function getUserProfile(req, res, next) {
    // TODO Fetch Full data of the user from the database
    const user = getMockUser();

    // Create image src for avatar api with user's full name
    user.avatar =`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`
    res.render("user/user_profile", {user, auth: req.isLoggedIn})
}

module.exports = {
    getUserProfile,
    getUserDashboard
}