/*
 * This controller should handle any operations related to the admin dashboard and miscellaneous admin operations
 */

const {renderAdminLayout} = require("../../util/layout/layoutUtils");

function getAdminDashboard(req, res, next) {
    const route = req.params.contentRoute ?? "dashboard";

    const admin = {
        name: "Chuck",
        lastName: "Norris"
    }

    renderAdminLayout(res, "dashboard",{admin, numOfUsers: 11, savedCo2:124.3, numOfFinishedTransactions: 1121})
}

module.exports = {
    getAdminDashboard
}