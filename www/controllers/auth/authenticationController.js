/*
 * This controller should handle any operations related to authentication such as login, logout, and registration
 */

function getLoginPage(req, res, next)  {
    //TODO: Add functionality for the login page
    res.send('[LOGIN PAGE HERE]')
}

function getRegisterPage(req, res, next) {
    //TODO: Add functionality for the register page
    res.send('[REGISTER PAGE HERE]')
}

module.exports = {
    getLoginPage,
    getRegisterPage
}