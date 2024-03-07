/*
 * This controller should handle any operations related to auth such as login, logout, and registration
 */

function getLoginPage(req, res, next) {
    //TODO: Add functionality for the login page
    res.render("auth/login", {auth: false})
}

function getRegisterPage(req, res, next) {
    //TODO: Add functionality for the register page
    res.render("auth/register", {auth: false})
}

module.exports = {
    getLoginPage,
    getRegisterPage,
}