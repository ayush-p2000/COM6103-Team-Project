/*
 * This controller should handle any operations related to the admin dashboard and miscellaneous admin operations
 */

function getAdminDashboard(req, res, next) {
    const admin = {
        name: "Chuck",
        lastName: "Norris"
    }
    res.render("admin/dashboard", {admin, numOfUsers: 11, savedCo2:124.3, numOfFinishedTransactions: 1121})
}

module.exports = {
    getAdminDashboard
}