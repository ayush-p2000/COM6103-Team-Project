/*
 * This controller should handle any operations related to account management
 */

const {getMockAccountsList, getMockUser} = require('../../util/mock/mockData')
const {renderAdminLayout, renderAdminLayoutPlaceholder} = require("../../util/layout/layoutUtils");

function getAccountsPage(req, res, next) {
    const users = getMockAccountsList();
    renderAdminLayout(req, res, "user_management", {users});
}

function getAccountDetailsPage(req, res, next) {
// TODO Remove dummy retrieval
    const user = getMockUser()
    renderAdminLayout(req, res, "user_details", {user});
}

function getEditAccountPage(req, res, next) {
    //TODO: Add functionality for editing account details
    renderAdminLayoutPlaceholder(res, "edit_user", {}, "Edit Account Details (out of scope)");
}

module.exports = {
    getAccountsPage,
    getAccountDetailsPage,
    getEditAccountPage
}