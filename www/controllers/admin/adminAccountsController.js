/*
 * This controller should handle any operations related to account management
 */

const {getMockAccountsList, getMockUser} = require('../../util/mock/mockData')

function getAccountsPage(req, res, next) {
    const users = getMockAccountsList();
    res.render('admin/user_management', {users});
}

function getAccountDetailsPage(req, res, next) {
// TODO Remove dummy retrieval
    const user = getMockUser()
    res.render('admin/user_details', {user});
}

function getEditAccountPage(req, res, next) {
    //TODO: Add functionality for editing account details
    res.send('[Edit Account Page Here]')
}

module.exports = {
    getAccountsPage,
    getAccountDetailsPage,
    getEditAccountPage
}