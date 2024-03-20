/*
 * This controller should handle any operations related to account management
 */

const {getMockAccountsList, getMockUser} = require('../../util/mock/mockData')
const {renderAdminLayout, renderAdminLayoutPlaceholder} = require("../../util/layout/layoutUtils");
const {getAllUsers, getUserById, searchUserAndPopulate, searchUser} = require("../../model/mongodb");

async function getAccountsPage(req, res, next) {
    let users = [];
    try {
        users = await getAllUsers();
        renderAdminLayout(req, res, "user_management", {users});
    } catch (e) {
        console.error(e);
        renderAdminLayout(req, res, "user_management", {users, error: "Failed to retrieve user data"});
    }
}

async function getAccountDetailsPage(req, res, next) {
    const user = await searchUserAndPopulate({_id: req.params.id});
    renderAdminLayout(req, res, "user_details", {userDetails: user});

}

function getEditAccountPage(req, res, next) {
    //TODO: Add functionality for editing account details
    renderAdminLayoutPlaceholder(req, res, "edit_user", {}, "Edit Account Details (out of scope)");
}

module.exports = {
    getAccountsPage,
    getAccountDetailsPage,
    getEditAccountPage
}